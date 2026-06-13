const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato BatchTransfer", function () {
  let BatchTransfer;
  let batchTransferContract;
  let BaseERC20;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    // Obtener los signers
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Desplegar el token ERC20 de prueba
    BaseERC20 = await ethers.getContractFactory("BaseERC20");
    token = await BaseERC20.deploy("Token de Prueba", "TDP", owner.address);

    // Desplegar el contrato BatchTransfer
    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransferContract = await BatchTransfer.deploy();

    // Acuñar algunos tokens al propietario para realizar las pruebas
    const cantidadAcuñar = ethers.parseEther("1000");
    await token.mint(owner.address, cantidadAcuñar);
  });

  describe("Transferencia por Lotes Estándar (batchTransfer)", function () {
    it("Debería transferir tokens correctamente a múltiples destinatarios", async function () {
      const amountPerRecipient = ethers.parseEther("10");
      const recipients = [addr1.address, addr2.address, addr3.address];
      const totalAmount = amountPerRecipient * BigInt(recipients.length);

      // Aprobar al contrato para gastar los tokens del propietario
      await token.approve(await batchTransferContract.getAddress(), totalAmount);

      // Guardar saldos iniciales
      const balanceInicialAddr1 = await token.balanceOf(addr1.address);
      const balanceInicialAddr2 = await token.balanceOf(addr2.address);
      const balanceInicialAddr3 = await token.balanceOf(addr3.address);

      // Ejecutar la transferencia por lotes
      const tx = await batchTransferContract.batchTransfer(
        await token.getAddress(),
        amountPerRecipient,
        recipients
      );

      // Verificar que se emita el evento correspondiente
      await expect(tx)
        .to.emit(batchTransferContract, "TransferenciaPorLote")
        .withArgs(
          await token.getAddress(),
          owner.address,
          totalAmount,
          recipients.length
        );

      // Verificar nuevos saldos de los destinatarios
      expect(await token.balanceOf(addr1.address)).to.equal(balanceInicialAddr1 + amountPerRecipient);
      expect(await token.balanceOf(addr2.address)).to.equal(balanceInicialAddr2 + amountPerRecipient);
      expect(await token.balanceOf(addr3.address)).to.equal(balanceInicialAddr3 + amountPerRecipient);

      // El contrato no debe retener tokens
      expect(await token.balanceOf(await batchTransferContract.getAddress())).to.equal(0n);
    });

    it("Debería fallar si no se aprueba el monto total", async function () {
      const amountPerRecipient = ethers.parseEther("10");
      const recipients = [addr1.address, addr2.address];
      
      // Intentar realizar la transferencia sin aprobación previa
      // El error de OpenZeppelin ERC20 es ERC20InsufficientAllowance
      await expect(
        batchTransferContract.batchTransfer(
          await token.getAddress(),
          amountPerRecipient,
          recipients
        )
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });

    it("Debería revertir si la lista de destinatarios está vacía", async function () {
      const amountPerRecipient = ethers.parseEther("10");
      
      await expect(
        batchTransferContract.batchTransfer(
          await token.getAddress(),
          amountPerRecipient,
          []
        )
      ).to.be.revertedWith("Debe proporcionar al menos un destinatario");
    });

    it("Debería revertir si la cantidad es cero", async function () {
      const recipients = [addr1.address];
      await expect(
        batchTransferContract.batchTransfer(
          await token.getAddress(),
          0n,
          recipients
        )
      ).to.be.revertedWith("La cantidad a transferir debe ser mayor a cero");
    });

    it("Debería revertir si la dirección del token es cero", async function () {
      const recipients = [addr1.address];
      await expect(
        batchTransferContract.batchTransfer(
          ethers.ZeroAddress,
          ethers.parseEther("10"),
          recipients
        )
      ).to.be.revertedWith("Direccion del token no valida");
    });

    it("Debería revertir si hay una dirección de destinatario no válida", async function () {
      const amountPerRecipient = ethers.parseEther("10");
      const recipients = [addr1.address, ethers.ZeroAddress];
      const totalAmount = amountPerRecipient * 2n;

      await token.approve(await batchTransferContract.getAddress(), totalAmount);

      await expect(
        batchTransferContract.batchTransfer(
          await token.getAddress(),
          amountPerRecipient,
          recipients
        )
      ).to.be.revertedWith("Direccion de destinatario no valida");
    });
  });

  describe("Transferencia por Lotes con Permit (batchTransferWithPermit)", function () {
    it("Debería permitir la aprobación y transferencia en una misma transacción usando firma de Permit", async function () {
      const amountPerRecipient = ethers.parseEther("15");
      const recipients = [addr1.address, addr2.address];
      const totalAmount = amountPerRecipient * BigInt(recipients.length);

      // Obtener la información para la firma EIP-712
      const network = await ethers.provider.getNetwork();
      const chainId = network.chainId;
      const nonce = await token.nonces(owner.address);
      const tokenName = await token.name();
      const tokenAddress = await token.getAddress();
      const contractAddress = await batchTransferContract.getAddress();

      const domain = {
        name: tokenName,
        version: "1",
        chainId: chainId,
        verifyingContract: tokenAddress
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      };

      const deadline = Math.floor(Date.now() / 1000) + 3600; // Validez de 1 hora

      const message = {
        owner: owner.address,
        spender: contractAddress,
        value: totalAmount,
        nonce: nonce,
        deadline: deadline
      };

      // Firmar los datos off-chain
      const signature = await owner.signTypedData(domain, types, message);
      const sig = ethers.Signature.from(signature);

      // Guardar saldos iniciales
      const balanceInicialAddr1 = await token.balanceOf(addr1.address);
      const balanceInicialAddr2 = await token.balanceOf(addr2.address);

      // Ejecutar la transferencia con permit (sin necesidad de llamar a approve externamente)
      const tx = await batchTransferContract.batchTransferWithPermit(
        tokenAddress,
        amountPerRecipient,
        recipients,
        deadline,
        sig.v,
        sig.r,
        sig.s
      );

      // Verificar que se emita el evento correspondiente
      await expect(tx)
        .to.emit(batchTransferContract, "TransferenciaPorLote")
        .withArgs(
          tokenAddress,
          owner.address,
          totalAmount,
          recipients.length
        );

      // Verificar saldos finales
      expect(await token.balanceOf(addr1.address)).to.equal(balanceInicialAddr1 + amountPerRecipient);
      expect(await token.balanceOf(addr2.address)).to.equal(balanceInicialAddr2 + amountPerRecipient);
    });

    it("Debería revertir si la firma del permit es inválida o expiró", async function () {
      const amountPerRecipient = ethers.parseEther("15");
      const recipients = [addr1.address, addr2.address];
      const tokenAddress = await token.getAddress();

      const deadlineExpitado = Math.floor(Date.now() / 1000) - 3600; // Expirado hace 1 hora

      // Firma incorrecta (valores vacíos o inválidos)
      const v = 27;
      const r = ethers.ZeroHash;
      const s = ethers.ZeroHash;

      // Debería revertir debido a que el permit fallará e intentará transferir sin aprobación suficiente
      await expect(
        batchTransferContract.batchTransferWithPermit(
          tokenAddress,
          amountPerRecipient,
          recipients,
          deadlineExpitado,
          v,
          r,
          s
        )
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });
});
