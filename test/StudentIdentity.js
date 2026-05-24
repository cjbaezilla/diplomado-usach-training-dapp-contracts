const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contrato StudentIdentity", function () {
  let StudentIdentity;
  let studentIdentity;
  let owner;
  let estudiante1;
  let estudiante2;

  // Datos de prueba para estudiante 1
  const nombre1 = "Carlos Baeza";
  const email1 = "carlos@example.com";
  const linkedin1 = "linkedin.com/in/carlos-baeza";
  const twitter1 = "@carlos_baeza";
  const avatar1 = "ipfs://QmHashAvatar1";

  // Datos de prueba para estudiante 2
  const nombre2 = "Ana Gomez";
  const email2 = "ana@example.com";
  const linkedin2 = "linkedin.com/in/ana-gomez";
  const twitter2 = "@ana_gomez";
  const avatar2 = "ipfs://QmHashAvatar2";

  beforeEach(async function () {
    // Obtener los signers
    [owner, estudiante1, estudiante2] = await ethers.getSigners();

    // Obtener la fábrica del contrato
    StudentIdentity = await ethers.getContractFactory("StudentIdentity");

    // Desplegar el contrato
    studentIdentity = await StudentIdentity.deploy();
  });

  describe("Registro de Perfil (Primera vez)", function () {
    it("Debería registrar un perfil con todos los campos correctamente", async function () {
      // Registrar perfil para estudiante 1
      await expect(
        studentIdentity
          .connect(estudiante1)
          .setProfile(nombre1, email1, linkedin1, twitter1, avatar1)
      )
        .to.emit(studentIdentity, "ProfileRegistered")
        .withArgs(estudiante1.address, nombre1, email1)
        .and.to.emit(studentIdentity, "ProfileUpdated");

      // Consultar el perfil registrado
      const perfil = await studentIdentity.getProfile(estudiante1.address);

      expect(perfil.name).to.equal(nombre1);
      expect(perfil.email).to.equal(email1);
      expect(perfil.linkedin).to.equal(linkedin1);
      expect(perfil.twitter).to.equal(twitter1);
      expect(perfil.avatar).to.equal(avatar1);
      expect(perfil.isRegistered).to.be.true;
      expect(perfil.updatedAt).to.be.gt(0);
    });

    it("Debería agregar la dirección al listado global y aumentar el contador", async function () {
      // Antes de registrar, el contador debe ser 0
      expect(await studentIdentity.getStudentsCount()).to.equal(0);

      // Registrar estudiante 1
      await studentIdentity
        .connect(estudiante1)
        .setProfile(nombre1, email1, linkedin1, twitter1, avatar1);

      // El contador debe ser 1
      expect(await studentIdentity.getStudentsCount()).to.equal(1);

      // Registrar estudiante 2
      await studentIdentity
        .connect(estudiante2)
        .setProfile(nombre2, email2, linkedin2, twitter2, avatar2);

      // El contador debe ser 2
      expect(await studentIdentity.getStudentsCount()).to.equal(2);

      // Obtener todas las direcciones registradas
      const estudiantes = await studentIdentity.getAllRegisteredStudents();
      expect(estudiantes.length).to.equal(2);
      expect(estudiantes[0]).to.equal(estudiante1.address);
      expect(estudiantes[1]).to.equal(estudiante2.address);
    });
  });

  describe("Actualización de Perfil", function () {
    beforeEach(async function () {
      // Registrar perfil inicial de estudiante 1
      await studentIdentity
        .connect(estudiante1)
        .setProfile(nombre1, email1, linkedin1, twitter1, avatar1);
    });

    it("Debería permitir al estudiante actualizar su perfil y emitir solo ProfileUpdated", async function () {
      const nuevoNombre = "Carlos Baeza N.";
      const nuevoEmail = "carlos.nuevo@example.com";
      const nuevoLinkedin = "linkedin.com/in/carlos-baeza-nuevo";
      const nuevoTwitter = "@carlos_b_nuevo";
      const nuevoAvatar = "ipfs://QmHashAvatar1Nuevo";

      // Al actualizar, se emite ProfileUpdated, pero NO ProfileRegistered
      const tx = studentIdentity
        .connect(estudiante1)
        .setProfile(nuevoNombre, nuevoEmail, nuevoLinkedin, nuevoTwitter, nuevoAvatar);

      await expect(tx).to.emit(studentIdentity, "ProfileUpdated");
      await expect(tx).to.not.emit(studentIdentity, "ProfileRegistered");

      // Consultar el perfil actualizado
      const perfil = await studentIdentity.getProfile(estudiante1.address);

      expect(perfil.name).to.equal(nuevoNombre);
      expect(perfil.email).to.equal(nuevoEmail);
      expect(perfil.linkedin).to.equal(nuevoLinkedin);
      expect(perfil.twitter).to.equal(nuevoTwitter);
      expect(perfil.avatar).to.equal(nuevoAvatar);
      expect(perfil.isRegistered).to.be.true;
    });

    it("No debería duplicar la dirección del estudiante en el listado tras una actualización", async function () {
      // El contador debe ser 1 antes de actualizar
      expect(await studentIdentity.getStudentsCount()).to.equal(1);

      // Actualizar perfil
      await studentIdentity
        .connect(estudiante1)
        .setProfile("Carlos B.", email1, linkedin1, twitter1, avatar1);

      // El contador debe seguir siendo 1
      expect(await studentIdentity.getStudentsCount()).to.equal(1);

      const estudiantes = await studentIdentity.getAllRegisteredStudents();
      expect(estudiantes.length).to.equal(1);
      expect(estudiantes[0]).to.equal(estudiante1.address);
    });
  });

  describe("Validaciones de Negocio", function () {
    it("Debería revertir si se intenta registrar un perfil con el nombre vacío", async function () {
      // Nombre vacío debe fallar
      await expect(
        studentIdentity
          .connect(estudiante1)
          .setProfile("", email1, linkedin1, twitter1, avatar1)
      ).to.be.revertedWithCustomError(studentIdentity, "NameRequired");
    });
  });

  describe("Consultas de Perfiles No Registrados", function () {
    it("Debería retornar un perfil vacío y isRegistered en falso si la dirección no está registrada", async function () {
      const perfil = await studentIdentity.getProfile(estudiante2.address);

      expect(perfil.name).to.equal("");
      expect(perfil.email).to.equal("");
      expect(perfil.linkedin).to.equal("");
      expect(perfil.twitter).to.equal("");
      expect(perfil.avatar).to.equal("");
      expect(perfil.isRegistered).to.be.false;
      expect(perfil.updatedAt).to.equal(0);
    });
  });
});
