const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @dev Módulo de Hardhat Ignition para desplegar el contrato StudentIdentity.
 */
module.exports = buildModule("StudentIdentityModule", (m) => {
  // Desplegar el contrato StudentIdentity
  const studentIdentity = m.contract("StudentIdentity");

  return { studentIdentity };
});
