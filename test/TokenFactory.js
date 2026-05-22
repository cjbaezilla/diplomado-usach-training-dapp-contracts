const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato TokenFactory", function () {
  let TokenFactory;
  let factory;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Obtener los signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Obtener la fábrica del contrato TokenFactory
    TokenFactory = await ethers.getContractFactory("TokenFactory");

    // Desplegar el contrato TokenFactory
    factory = await TokenFactory.deploy();
  });

  describe("Despliegue", function () {
    it("Debería iniciar con cero tokens", async function () {
      expect(await factory.getTokensCount()).to.equal(0);
      expect((await factory.getAllTokens()).length).to.equal(0);
    });
  });

  describe("Creación de Tokens", function () {
    const nombreToken = "Mi Token Factory";
    const simboloToken = "MTF";

    it("Debería crear un nuevo token ERC20 y emitir el evento TokenCreated", async function () {
      await expect(factory.createToken(nombreToken, simboloToken, addr1.address))
        .to.emit(factory, "TokenCreated")
        .withArgs(ethers.isAddress, addr1.address, nombreToken, simboloToken);
    });

    it("Debería registrar correctamente el token y el propietario", async function () {
      // Crear el token
      const tx = await factory.createToken(nombreToken, simboloToken, addr1.address);
      const receipt = await tx.wait();

      // Buscar la dirección del token en los logs
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "TokenCreated"
      );
      const tokenAddress = event.args.tokenAddress;

      // Verificar que el token esté registrado en el array global
      expect(await factory.getTokensCount()).to.equal(1);
      expect((await factory.getAllTokens())[0]).to.equal(tokenAddress);

      // Verificar que el token esté registrado en los tokens por propietario
      const tokensDelPropietario = await factory.getTokensByOwner(addr1.address);
      expect(tokensDelPropietario.length).to.equal(1);
      expect(tokensDelPropietario[0]).to.equal(tokenAddress);

      // Verificar la función de verificación isTokenCreated
      expect(await factory.isTokenCreated(tokenAddress)).to.be.true;
      expect(await factory.isTokenCreated(addr2.address)).to.be.false;
    });

    it("El token recién creado debería tener el nombre, símbolo y propietario correctos", async function () {
      const tx = await factory.createToken(nombreToken, simboloToken, addr1.address);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "TokenCreated"
      );
      const tokenAddress = event.args.tokenAddress;

      // Obtener la instancia del token desplegado
      const token = await ethers.getContractAt("BaseERC20", tokenAddress);

      // Verificar los atributos del token
      expect(await token.name()).to.equal(nombreToken);
      expect(await token.symbol()).to.equal(simboloToken);
      expect(await token.owner()).to.equal(addr1.address);
    });

    it("El propietario del token creado debería poder acuñar y gestionar el token", async function () {
      const tx = await factory.createToken(nombreToken, simboloToken, addr1.address);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "TokenCreated"
      );
      const tokenAddress = event.args.tokenAddress;
      const token = await ethers.getContractAt("BaseERC20", tokenAddress);

      // El propietario inicial (addr1) debería poder acuñar
      const cantidad = ethers.parseEther("500");
      await token.connect(addr1).mint(addr2.address, cantidad);
      expect(await token.balanceOf(addr2.address)).to.equal(cantidad);

      // Un usuario no propietario no debería poder acuñar
      const errorDePropiedad = "OwnableUnauthorizedAccount";
      await expect(
        token.connect(addr2).mint(addr1.address, cantidad)
      ).to.be.revertedWithCustomError(token, errorDePropiedad);
    });

    it("Debería revertir si el propietario inicial es la dirección cero", async function () {
      await expect(
        factory.createToken(nombreToken, simboloToken, ethers.ZeroAddress)
      ).to.be.revertedWith("TokenFactory: el propietario no puede ser la direccion cero");
    });
  });

  describe("Seguimiento de Múltiples Tokens", function () {
    it("Debería rastrear múltiples tokens por el mismo y por diferentes propietarios", async function () {
      // Propietario 1 (addr1) crea 2 tokens
      await factory.createToken("Token A", "TKA", addr1.address);
      await factory.createToken("Token B", "TKB", addr1.address);

      // Propietario 2 (addr2) crea 1 token
      await factory.createToken("Token C", "TKC", addr2.address);

      expect(await factory.getTokensCount()).to.equal(3);

      const tokensPropietario1 = await factory.getTokensByOwner(addr1.address);
      expect(tokensPropietario1.length).to.equal(2);

      const tokensPropietario2 = await factory.getTokensByOwner(addr2.address);
      expect(tokensPropietario2.length).to.equal(1);
    });
  });
});
