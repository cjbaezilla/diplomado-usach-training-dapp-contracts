const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato BaseERC20", function () {
  let BaseERC20;
  let token;
  let owner;
  let addr1;
  let addr2;

  const nombreToken = "Token de Prueba";
  const simboloToken = "TDP";

  beforeEach(async function () {
    // Obtener los signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Obtener la fábrica del contrato
    BaseERC20 = await ethers.getContractFactory("BaseERC20");

    // Desplegar el contrato pasando nombre, símbolo y dirección del propietario inicial
    token = await BaseERC20.deploy(nombreToken, simboloToken, owner.address);
  });

  describe("Despliegue", function () {
    it("Debería asignar el nombre y el símbolo correctamente", async function () {
      expect(await token.name()).to.equal(nombreToken);
      expect(await token.symbol()).to.equal(simboloToken);
    });

    it("Debería asignar el propietario inicial correctamente", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Acuñación (Minting)", function () {
    it("El propietario debería poder acuñar tokens", async function () {
      const cantidad = ethers.parseEther("100");
      await token.mint(addr1.address, cantidad);
      expect(await token.balanceOf(addr1.address)).to.equal(cantidad);
    });

    it("Un usuario no propietario no debería poder acuñar tokens", async function () {
      const cantidad = ethers.parseEther("100");
      const errorDePropiedad = "OwnableUnauthorizedAccount";
      await expect(
        token.connect(addr1).mint(addr2.address, cantidad)
      ).to.be.revertedWithCustomError(token, errorDePropiedad);
    });
  });

  describe("Pausar / Despausar", function () {
    it("El propietario debería poder pausar y despausar el contrato", async function () {
      await token.pause();
      expect(await token.paused()).to.be.true;

      await token.unpause();
      expect(await token.paused()).to.be.false;
    });

    it("No se deberían poder transferir tokens mientras esté pausado", async function () {
      const cantidad = ethers.parseEther("50");
      
      // Primero acuñamos tokens al owner
      await token.mint(owner.address, cantidad);

      // Pausamos el contrato
      await token.pause();

      // Intentamos transferir
      const errorPausado = "EnforcedPause";
      await expect(
        token.transfer(addr1.address, cantidad)
      ).to.be.revertedWithCustomError(token, errorPausado);
    });
  });
});
