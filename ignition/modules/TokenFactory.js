const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @dev Módulo de Hardhat Ignition para desplegar el contrato TokenFactory.
 */
module.exports = buildModule("TokenFactoryModule", (m) => {
  // Desplegar el contrato TokenFactory
  const tokenFactory = m.contract("TokenFactory");

  return { tokenFactory };
});
