const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @dev Módulo de Hardhat Ignition para desplegar el contrato WETH.
 * Todos los comentarios están en español de acuerdo con las directrices.
 */
module.exports = buildModule("WETHModule", (m) => {
  // Desplegar el contrato WETH
  const weth = m.contract("WETH");

  return { weth };
});
