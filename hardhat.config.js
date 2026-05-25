require("@nomicfoundation/hardhat-toolbox");
// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Configurar cuenta para despliegue si existe una clave privada válida
const accounts = [];
if (PRIVATE_KEY && PRIVATE_KEY !== "0000000000000000000000000000000000000000000000000000000000000000") {
  accounts.push(PRIVATE_KEY);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.35",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
