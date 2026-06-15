const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato BaseERC1155 (MyToken)", function () {
  let MyToken;
  let token;
  let admin;
  let minter;
  let addr1;

  beforeEach(async function () {
    // Obtener los signers
    [admin, minter, addr1] = await ethers.getSigners();

    // Obtener la fábrica del contrato BaseERC1155 definido en BaseERC1155.sol usando el nombre calificado
    MyToken = await ethers.getContractFactory("contracts/BaseERC1155.sol:BaseERC1155");

    // Desplegar el contrato pasando la dirección del administrador y del minter
    token = await MyToken.deploy(admin.address, minter.address);
  });

  describe("Despliegue y Configuración Inicial", function () {
    it("Debería retornar la URI correcta con el ID en decimal y formato .json", async function () {
      const id = 1;
      const uriEsperada = `https://web3-usach-lab.cbaeza.com/nft/usach/relics/${id}.json`;
      expect(await token.uri(id)).to.equal(uriEsperada);
    });

    it("Debería funcionar dinámicamente con IDs de múltiples dígitos", async function () {
      const id = 456;
      const uriEsperada = `https://web3-usach-lab.cbaeza.com/nft/usach/relics/${id}.json`;
      expect(await token.uri(id)).to.equal(uriEsperada);
    });

    it("Debería asignar los roles iniciales correctamente", async function () {
      const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
      const URI_SETTER_ROLE = await token.URI_SETTER_ROLE();
      const MINTER_ROLE = await token.MINTER_ROLE();

      // El administrador debería tener el DEFAULT_ADMIN_ROLE y el URI_SETTER_ROLE
      expect(await token.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await token.hasRole(URI_SETTER_ROLE, admin.address)).to.be.true;

      // El minter debería tener el MINTER_ROLE
      expect(await token.hasRole(MINTER_ROLE, minter.address)).to.be.true;
    });
  });

  describe("Modificación de la URI Base", function () {
    it("El administrador (con URI_SETTER_ROLE) debería poder cambiar la URI base", async function () {
      const nuevaBaseURI = "https://otrowebsite.com/tokens/";
      
      // Cambiar la URI base
      await token.connect(admin).setURI(nuevaBaseURI);

      // Comprobar que la URI de un token refleja el cambio dinámicamente
      const id = 42;
      const uriEsperada = `https://otrowebsite.com/tokens/${id}.json`;
      expect(await token.uri(id)).to.equal(uriEsperada);
    });

    it("Una dirección sin el rol URI_SETTER_ROLE no debería poder cambiar la URI base", async function () {
      const nuevaBaseURI = "https://hackersite.com/tokens/";
      const URI_SETTER_ROLE = await token.URI_SETTER_ROLE();

      // Intentar cambiar la base URI desde una cuenta no autorizada
      await expect(
        token.connect(addr1).setURI(nuevaBaseURI)
      ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Acuñación (Minting)", function () {
    it("La cuenta con el rol MINTER_ROLE debería poder acuñar tokens", async function () {
      const idToken = 10;
      const cantidad = 100;
      
      // El minter acuña tokens para addr1
      await token.connect(minter).mint(addr1.address, idToken, cantidad, "0x");
      
      expect(await token.balanceOf(addr1.address, idToken)).to.equal(cantidad);
    });

    it("Una cuenta sin el rol MINTER_ROLE no debería poder acuñar tokens", async function () {
      const idToken = 10;
      const cantidad = 100;

      // Intentar acuñar desde la cuenta no autorizada addr1
      await expect(
        token.connect(addr1).mint(admin.address, idToken, cantidad, "0x")
      ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
    });
  });
});
