const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @dev Módulo de Hardhat Ignition para desplegar el contrato BatchTransfer.
 */
module.exports = buildModule("BatchTransferModule", (m) => {
  // Desplegar el contrato BatchTransfer
  const batchTransfer = m.contract("BatchTransfer");

  return { batchTransfer };
});
