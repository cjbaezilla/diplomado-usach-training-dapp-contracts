const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @dev Módulo de Hardhat Ignition para desplegar el contrato DEXFactory.
 * Los pools individuales se crearán dinámicamente invocando la función `crearPool` de la fábrica.
 */
module.exports = buildModule("DEXModule", (m) => {
  // Desplegar el contrato DEXFactory
  const dexFactory = m.contract("DEXFactory");

  return { dexFactory };
});
