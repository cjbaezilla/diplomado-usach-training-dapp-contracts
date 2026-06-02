const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato ChallengeMinter", function () {
  let BaseERC1155;
  let ChallengeMinter;
  
  let nftContract;
  let minterContract;
  
  let admin;
  let authorizedSigner;
  let unauthorizedSigner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Obtener los signers desde Hardhat
    [admin, authorizedSigner, unauthorizedSigner, user1, user2] = await ethers.getSigners();

    // 1. Desplegar el contrato BaseERC1155
    BaseERC1155 = await ethers.getContractFactory("contracts/BaseERC1155.sol:BaseERC1155");
    nftContract = await BaseERC1155.deploy(admin.address, admin.address);

    // 2. Desplegar el contrato ChallengeMinter
    ChallengeMinter = await ethers.getContractFactory("ChallengeMinter");
    minterContract = await ChallengeMinter.deploy(
      admin.address,
      authorizedSigner.address,
      await nftContract.getAddress()
    );

    // 3. Otorgar el MINTER_ROLE de BaseERC1155 al contrato ChallengeMinter
    const MINTER_ROLE = await nftContract.MINTER_ROLE();
    await nftContract.connect(admin).grantRole(MINTER_ROLE, await minterContract.getAddress());
  });

  describe("Despliegue y Configuración de Roles", function () {
    it("Debería inicializar las direcciones correctamente", async function () {
      expect(await minterContract.nftContract()).to.equal(await nftContract.getAddress());
    });

    it("Debería asignar el DEFAULT_ADMIN_ROLE al administrador", async function () {
      const DEFAULT_ADMIN_ROLE = await minterContract.DEFAULT_ADMIN_ROLE();
      expect(await minterContract.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
    });

    it("Debería asignar el SIGNER_ROLE al firmante autorizado", async function () {
      const SIGNER_ROLE = await minterContract.SIGNER_ROLE();
      expect(await minterContract.hasRole(SIGNER_ROLE, authorizedSigner.address)).to.be.true;
      expect(await minterContract.hasRole(SIGNER_ROLE, unauthorizedSigner.address)).to.be.false;
    });
  });

  describe("Reclamo de Desafíos mediante Firma (claimChallenge)", function () {
    const tokenId = 3; // Insignia #3
    const salt = ethers.encodeBytes32String("desafio-usach-001");

    // Función auxiliar para firmar datos off-chain usando Ethers.js
    async function obtenerFirma(signer, userAddress, tokenId, salt, minterContractAddress) {
      // Calcular el hash del mensaje coincidiendo exactamente con Solidity (sin el parámetro amount)
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "bytes32", "address"],
        [userAddress, tokenId, salt, minterContractAddress]
      );
      
      // Firmar el mensaje. Ethers aplica automáticamente el prefijo "\x19Ethereum Signed Message:\n32"
      const messageBytes = ethers.getBytes(messageHash);
      const signature = await signer.signMessage(messageBytes);
      return signature;
    }

    it("Debería permitir reclamar el NFT con una firma válida del Signer autorizado", async function () {
      const minterAddr = await minterContract.getAddress();
      
      // Generar la firma del reclamo para user1
      const signature = await obtenerFirma(
        authorizedSigner,
        user1.address,
        tokenId,
        salt,
        minterAddr
      );

      // El balance inicial de user1 debería ser 0
      expect(await nftContract.balanceOf(user1.address, tokenId)).to.equal(0);

      // user1 realiza el reclamo enviando la firma
      const tx = await minterContract.connect(user1).claimChallenge(
        tokenId,
        salt,
        signature
      );

      // Validar que se emitió el evento ChallengeClaimed indicando que se minteó 1
      await expect(tx)
        .to.emit(minterContract, "ChallengeClaimed")
        .withArgs(user1.address, tokenId, 1, salt);

      // Validar que el balance de user1 en el NFT se actualizó a 1
      expect(await nftContract.balanceOf(user1.address, tokenId)).to.equal(1);
    });

    it("Debería fallar si la firma proviene de una dirección no autorizada (sin SIGNER_ROLE)", async function () {
      const minterAddr = await minterContract.getAddress();

      // Generar una firma usando una clave no autorizada
      const signature = await obtenerFirma(
        unauthorizedSigner,
        user1.address,
        tokenId,
        salt,
        minterAddr
      );

      // Debería revertir la transacción con error de firma no autorizada
      await expect(
        minterContract.connect(user1).claimChallenge(tokenId, salt, signature)
      ).to.be.revertedWith("Firma invalida o no autorizada");
    });

    it("Debería fallar si se intenta reutilizar una firma (Replay Attack - Mismo Usuario)", async function () {
      const minterAddr = await minterContract.getAddress();
      
      const signature = await obtenerFirma(
        authorizedSigner,
        user1.address,
        tokenId,
        salt,
        minterAddr
      );

      // Primer reclamo exitoso
      await minterContract.connect(user1).claimChallenge(tokenId, salt, signature);

      // Segundo intento con la misma firma debería fallar
      await expect(
        minterContract.connect(user1).claimChallenge(tokenId, salt, signature)
      ).to.be.revertedWith("Esta recompensa ya fue reclamada");
    });

    it("Debería fallar si otro usuario intenta robar e ingresar la firma (Replay Attack - Diferente Usuario)", async function () {
      const minterAddr = await minterContract.getAddress();
      
      // Firma generada específicamente para user1
      const signature = await obtenerFirma(
        authorizedSigner,
        user1.address,
        tokenId,
        salt,
        minterAddr
      );

      // Si user2 intenta usar la firma para sí mismo, debería fallar
      await expect(
        minterContract.connect(user2).claimChallenge(tokenId, salt, signature)
      ).to.be.revertedWith("Firma invalida o no autorizada");
    });

    it("Debería fallar si se modifican los parámetros de entrada (Integridad del Mensaje)", async function () {
      const minterAddr = await minterContract.getAddress();

      // Firma generada para tokenId = 3
      const signature = await obtenerFirma(
        authorizedSigner,
        user1.address,
        tokenId,
        salt,
        minterAddr
      );

      // Intentar reclamar un ID de token diferente (ej: 4 en lugar de 3) con la misma firma
      await expect(
        minterContract.connect(user1).claimChallenge(4, salt, signature)
      ).to.be.revertedWith("Firma invalida o no autorizada");

      // Intentar reclamar con un salt diferente
      const saltDiferente = ethers.encodeBytes32String("desafio-usach-002");
      await expect(
        minterContract.connect(user1).claimChallenge(tokenId, saltDiferente, signature)
      ).to.be.revertedWith("Firma invalida o no autorizada");
    });

    it("Debería fallar si la firma fue emitida para otro contrato de minteo (Cross-contract Replay)", async function () {
      const minterAddr1 = await minterContract.getAddress();
      
      // Creamos un segundo contrato minteador
      const minterContract2 = await ChallengeMinter.deploy(
        admin.address,
        authorizedSigner.address,
        await nftContract.getAddress()
      );
      const minterAddr2 = await minterContract2.getAddress();

      // Generar firma para el minterContract 1
      const signatureMinter1 = await obtenerFirma(
        authorizedSigner,
        user1.address,
        tokenId,
        salt,
        minterAddr1
      );

      // Otorgar permisos al minterContract2 también
      const MINTER_ROLE = await nftContract.MINTER_ROLE();
      await nftContract.connect(admin).grantRole(MINTER_ROLE, minterAddr2);

      // Reclamar en el minterContract2 con la firma generada para el minterContract1 debería fallar
      await expect(
        minterContract2.connect(user1).claimChallenge(tokenId, salt, signatureMinter1)
      ).to.be.revertedWith("Firma invalida o no autorizada");
    });
  });

  describe("Control de Acceso y Gestión de Roles", function () {
    it("El administrador debería poder agregar nuevos firmantes autorizados", async function () {
      const SIGNER_ROLE = await minterContract.SIGNER_ROLE();

      // Otorgar rol a una nueva dirección
      await minterContract.connect(admin).grantRole(SIGNER_ROLE, unauthorizedSigner.address);

      // Ahora unauthorizedSigner debería poder firmar reclamos válidos
      const tokenId = 5;
      const salt = ethers.encodeBytes32String("desafio-usach-role-test");
      const minterAddr = await minterContract.getAddress();

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "bytes32", "address"],
        [user1.address, tokenId, salt, minterAddr]
      );
      const signature = await unauthorizedSigner.signMessage(ethers.getBytes(messageHash));

      await expect(
        minterContract.connect(user1).claimChallenge(tokenId, salt, signature)
      ).to.not.be.reverted;
    });

    it("El administrador debería poder revocar firmantes", async function () {
      const SIGNER_ROLE = await minterContract.SIGNER_ROLE();

      // Revocar el rol al firmante autorizado inicial
      await minterContract.connect(admin).revokeRole(SIGNER_ROLE, authorizedSigner.address);

      const tokenId = 5;
      const salt = ethers.encodeBytes32String("desafio-usach-role-revoke");
      const minterAddr = await minterContract.getAddress();

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "bytes32", "address"],
        [user1.address, tokenId, salt, minterAddr]
      );
      const signature = await authorizedSigner.signMessage(ethers.getBytes(messageHash));

      // La transacción debe fallar ahora porque el firmante fue revocado
      await expect(
        minterContract.connect(user1).claimChallenge(tokenId, salt, signature)
      ).to.be.revertedWith("Firma invalida o no autorizada");
    });
  });
});
