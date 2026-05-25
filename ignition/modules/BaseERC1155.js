const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @dev Módulo de Hardhat Ignition para desplegar el contrato BaseERC1155.
 */
module.exports = buildModule("BaseERC1155Module", (m) => {
  // Obtener cuentas para el constructor
  const defaultAdmin = m.getAccount(0);
  const minter = m.getAccount(0);

  // Desplegar el contrato BaseERC1155 pasando las direcciones correspondientes
  const baseERC1155 = m.contract("BaseERC1155", [defaultAdmin, minter]);

  return { baseERC1155 };
});
