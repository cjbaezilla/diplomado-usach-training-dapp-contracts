const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato WETH (Wrapped Ether)", function () {
  let WETH;
  let weth;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Obtener las cuentas de prueba
    [owner, addr1, addr2] = await ethers.getSigners();

    // Obtener la fábrica del contrato
    WETH = await ethers.getContractFactory("WETH");

    // Desplegar el contrato
    weth = await WETH.deploy();
  });

  describe("Despliegue y Configuración Inicial", function () {
    it("Debería inicializar los metadatos correctos", async function () {
      expect(await weth.name()).to.equal("Wrapped Ether");
      expect(await weth.symbol()).to.equal("WETH");
      expect(await weth.decimals()).to.equal(18);
    });

    it("Debería iniciar con un suministro total de cero", async function () {
      expect(await weth.totalSupply()).to.equal(0);
    });
  });

  describe("Depósitos (Deposit)", function () {
    it("Debería permitir depositar Ether mediante deposit()", async function () {
      const cantidad = ethers.parseEther("5.0");

      // El usuario realiza el depósito llamando a deposit() enviando valor
      await expect(weth.connect(addr1).deposit({ value: cantidad }))
        .to.emit(weth, "Deposit")
        .withArgs(addr1.address, cantidad);

      // El saldo de WETH de addr1 debe incrementarse
      expect(await weth.balanceOf(addr1.address)).to.equal(cantidad);
      // El suministro total debe incrementarse
      expect(await weth.totalSupply()).to.equal(cantidad);
      // El balance de ETH del contrato debe ser igual al total depositado
      expect(await ethers.provider.getBalance(weth.target)).to.equal(cantidad);
    });

    it("Debería recibir Ether directamente y envolverlo mediante receive()", async function () {
      const cantidad = ethers.parseEther("2.5");

      // El usuario envía Ether directamente al contrato
      const tx = await addr1.sendTransaction({
        to: weth.target,
        value: cantidad,
      });

      await expect(tx)
        .to.emit(weth, "Deposit")
        .withArgs(addr1.address, cantidad);

      expect(await weth.balanceOf(addr1.address)).to.equal(cantidad);
      expect(await weth.totalSupply()).to.equal(cantidad);
    });
  });

  describe("Retiros (Withdraw)", function () {
    beforeEach(async function () {
      // Depositar algo de ETH antes de cada prueba de retiro
      const cantidad = ethers.parseEther("10.0");
      await weth.connect(addr1).deposit({ value: cantidad });
    });

    it("Debería permitir retirar y recuperar Ether llamando a withdraw()", async function () {
      const cantidadRetiro = ethers.parseEther("4.0");

      // Medir balances antes del retiro
      const balanceEthPrevio = await ethers.provider.getBalance(addr1.address);
      const balanceWethPrevio = await weth.balanceOf(addr1.address);

      // Ejecutar el retiro
      const tx = await weth.connect(addr1).withdraw(cantidadRetiro);
      const receipt = await tx.wait();
      
      // Calcular costo de gas de la transacción
      const costoGas = receipt.gasUsed * receipt.gasPrice;

      // Medir balances después del retiro
      const balanceEthPosterior = await ethers.provider.getBalance(addr1.address);
      const balanceWethPosterior = await weth.balanceOf(addr1.address);

      // Comprobaciones
      expect(balanceWethPosterior).to.equal(balanceWethPrevio - cantidadRetiro);
      expect(balanceEthPosterior).to.equal(balanceEthPrevio + cantidadRetiro - costoGas);
      expect(await weth.totalSupply()).to.equal(ethers.parseEther("6.0"));

      await expect(tx)
        .to.emit(weth, "Withdrawal")
        .withArgs(addr1.address, cantidadRetiro);
    });

    it("Debería revertir si se intenta retirar más del saldo disponible", async function () {
      const cantidadExcedente = ethers.parseEther("11.0");

      await expect(
        weth.connect(addr1).withdraw(cantidadExcedente)
      ).to.be.revertedWith("WETH: saldo insuficiente");
    });
  });

  describe("Funcionalidad ERC-20 Estándar", function () {
    beforeEach(async function () {
      // Depositar fondos para pruebas de transferencias
      await weth.connect(addr1).deposit({ value: ethers.parseEther("5.0") });
    });

    it("Debería transferir tokens de forma directa usando transfer()", async function () {
      const cantidad = ethers.parseEther("2.0");

      await expect(weth.connect(addr1).transfer(addr2.address, cantidad))
        .to.emit(weth, "Transfer")
        .withArgs(addr1.address, addr2.address, cantidad);

      expect(await weth.balanceOf(addr1.address)).to.equal(ethers.parseEther("3.0"));
      expect(await weth.balanceOf(addr2.address)).to.equal(cantidad);
    });

    it("Debería revertir si transfer() no tiene saldo suficiente", async function () {
      const cantidadExcedente = ethers.parseEther("6.0");

      await expect(
        weth.connect(addr1).transfer(addr2.address, cantidadExcedente)
      ).to.be.revertedWith("WETH: saldo insuficiente del emisor");
    });

    it("Debería aprobar y permitir transferencias delegadas mediante transferFrom()", async function () {
      const cantidad = ethers.parseEther("3.0");

      // addr1 aprueba a addr2 para gastar 3.0 WETH
      await expect(weth.connect(addr1).approve(addr2.address, cantidad))
        .to.emit(weth, "Approval")
        .withArgs(addr1.address, addr2.address, cantidad);

      expect(await weth.allowance(addr1.address, addr2.address)).to.equal(cantidad);

      // addr2 transfiere de addr1 a sí mismo
      await expect(weth.connect(addr2).transferFrom(addr1.address, addr2.address, cantidad))
        .to.emit(weth, "Transfer")
        .withArgs(addr1.address, addr2.address, cantidad);

      expect(await weth.balanceOf(addr1.address)).to.equal(ethers.parseEther("2.0"));
      expect(await weth.balanceOf(addr2.address)).to.equal(cantidad);
      // La autorización debería haberse consumido
      expect(await weth.allowance(addr1.address, addr2.address)).to.equal(0);
    });

    it("Debería mantener la autorización intacta ante aprobación infinita", async function () {
      const cantidad = ethers.parseEther("1.0");
      const aprobacionInfinita = ethers.MaxUint256;

      // Aprobación de la cantidad máxima (infinita)
      await weth.connect(addr1).approve(addr2.address, aprobacionInfinita);

      // Realizar transferencia delegada
      await weth.connect(addr2).transferFrom(addr1.address, addr2.address, cantidad);

      // La autorización del gastador no debió cambiar
      expect(await weth.allowance(addr1.address, addr2.address)).to.equal(aprobacionInfinita);
    });

    it("Debería revertir transferFrom() si la autorización es insuficiente", async function () {
      const cantidadAprobada = ethers.parseEther("1.0");
      const cantidadIntento = ethers.parseEther("2.0");

      await weth.connect(addr1).approve(addr2.address, cantidadAprobada);

      await expect(
        weth.connect(addr2).transferFrom(addr1.address, addr2.address, cantidadIntento)
      ).to.be.revertedWith("WETH: autorizacion insuficiente");
    });
  });
});
