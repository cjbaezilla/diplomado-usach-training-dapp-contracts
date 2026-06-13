#!/usr/bin/env node

/**
 * Script CLI para realizar envíos por lotes de tokens ERC20 con parámetros estáticos (hardcoded).
 * Desarrollado para el Diplomado en dApps de la USACH.
 * 
 * Regla del repositorio: Toda documentación, escritura y comentarios están en ESPAÑOL.
 */

require("dotenv").config();
const { ethers } = require("ethers");

// Códigos de colores ANSI para mejorar la estética de la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m"
};

// ==================== CONFIGURACIÓN DE PARÁMETROS (MODIFICAR AQUÍ) ====================

// Dirección del token ERC20 que deseas enviar (ej: WETH Sepolia)
const TOKEN_ADDRESS = "0x074367Cd77370D869C0894508E314091960662B2";

// Cantidad de tokens a enviar a cada destinatario (ej. "0.05")
const AMOUNT_PER_RECIPIENT = "1";

// Arreglo de direcciones destinatarias
const RECIPIENTS = [
  "0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121",
  "0x743b4728b6895C8957d458b023C6F90E458D1D24",
  "0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF",
  "0xA78B57234A481d69393381Ac1642DBCadd9B66F1",
  "0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68",
  "0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39",
  "0x0F2DAF399f29CC57E10760a746B04434c9e0466B",
  "0x0e51080164B5Eb3F028D6A85deF9273457093c70",
  "0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce",
  "0xB8aAEA24217c8BB49b599d24Dc89671e8bC9EAe2",
  "0xf133e655555711E25CD9723a8e83A7C53a5D91a4",
  "0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42",
  "0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE",
  "0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3",
  "0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C",
  "0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f",
  "0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0",
  "0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B",
  "0x6b727bC4560A05AEEB9c353396395B35c6Fdb57E",
  "0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df",
  "0x42dde3f6ae39066b79767261afd4cb2c3d82ea96",
  "0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5",
  "0x652b7718F130329F3eC865f418FE2a2634fb5E29",
  "0x50E4FD9b22e928a10730F6A2726e72E29e4630Be"
];

// ======================================================================================

// Configuración predeterminada tomada de .env
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BATCH_TRANSFER_ADDRESS = "0x3c9323F2BaDdDBB1B152feFA33FEC0b748239860"; // Contrato desplegado en Sepolia

// ABIs mínimas requeridas para interactuar
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)"
];

const BATCH_TRANSFER_ABI = [
  "function batchTransfer(address token, uint256 amount, address[] calldata recipients) external"
];

function printBanner() {
  console.log(colors.magenta + colors.bright + "=========================================================" + colors.reset);
  console.log(colors.magenta + colors.bright + "  ⚡ ENVÍO DE TOKENS POR LOTE (PARÁMETROS ESTÁTICOS) ⚡" + colors.reset);
  console.log(colors.magenta + colors.bright + "=========================================================" + colors.reset);
}

async function main() {
  printBanner();

  // 1. Validar clave privada en el archivo .env
  if (!PRIVATE_KEY || PRIVATE_KEY === "0000000000000000000000000000000000000000000000000000000000000000") {
    console.log(colors.red + "🚨 ERROR: No se ha configurado una clave privada válida en el archivo .env." + colors.reset);
    console.log("Por favor, edita tu archivo .env e ingresa una llave privada válida.");
    return;
  }

  // 2. Configurar conexión con el proveedor y la billetera
  console.log(colors.yellow + "Conectando al nodo de Sepolia..." + colors.reset);
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(`${colors.green}✓ Billetera conectada:${colors.reset} ${wallet.address}`);

  // Consultar balance de ETH para pagar gas
  const balanceEth = await provider.getBalance(wallet.address);
  console.log(`${colors.green}✓ Balance de ETH:${colors.reset} ${ethers.formatEther(balanceEth)} ETH\n`);

  if (balanceEth === 0n) {
    console.log(colors.red + "⚠️ ADVERTENCIA: No tienes ETH en Sepolia para pagar el gas de las transacciones.\n" + colors.reset);
  }

  // 3. Validar los parámetros hardcodeados
  if (!ethers.isAddress(TOKEN_ADDRESS)) {
    console.log(colors.red + `🚨 ERROR: Dirección de token '${TOKEN_ADDRESS}' inválida.` + colors.reset);
    return;
  }

  if (isNaN(Number(AMOUNT_PER_RECIPIENT)) || Number(AMOUNT_PER_RECIPIENT) <= 0) {
    console.log(colors.red + `🚨 ERROR: Cantidad '${AMOUNT_PER_RECIPIENT}' inválida.` + colors.reset);
    return;
  }

  if (!RECIPIENTS || RECIPIENTS.length === 0) {
    console.log(colors.red + "🚨 ERROR: El arreglo de destinatarios está vacío." + colors.reset);
    return;
  }

  // Instanciar el contrato del token
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);
  let name, symbol, decimals;
  try {
    name = await tokenContract.name();
    symbol = await tokenContract.symbol();
    decimals = await tokenContract.decimals();
    console.log(`Token Detectado: ${colors.bright}${name} (${symbol})${colors.reset} - Decimales: ${decimals}`);
  } catch (error) {
    console.log(colors.red + `🚨 ERROR: No se pudo interactuar con el token en la dirección '${TOKEN_ADDRESS}'.` + colors.reset);
    console.log("Asegúrate de que la dirección corresponda a un token ERC20 válido en Sepolia.");
    return;
  }

  // Parsear cantidad
  const amountPerRecipient = ethers.parseUnits(AMOUNT_PER_RECIPIENT, decimals);

  // Validar direcciones destinatarias
  console.log(`\nDestinatarios configurados (${RECIPIENTS.length}):`);
  for (let i = 0; i < RECIPIENTS.length; i++) {
    if (!ethers.isAddress(RECIPIENTS[i])) {
      console.log(colors.red + `🚨 ERROR: Dirección inválida en la posición ${i + 1}: ${RECIPIENTS[i]}` + colors.reset);
      return;
    }
    console.log(`  [${i + 1}] ${RECIPIENTS[i]}`);
  }

  const totalAmount = amountPerRecipient * BigInt(RECIPIENTS.length);
  const formattedTotal = ethers.formatUnits(totalAmount, decimals);

  console.log(`\n${colors.bright}Resumen de Envío:${colors.reset}`);
  console.log(`- Cantidad por persona: ${AMOUNT_PER_RECIPIENT} ${symbol}`);
  console.log(`- Destinatarios:        ${RECIPIENTS.length}`);
  console.log(`- Total a distribuir:   ${formattedTotal} ${symbol}`);

  // 4. Validar balances y aprobaciones
  const myBalance = await tokenContract.balanceOf(wallet.address);
  console.log(`- Tu balance actual:    ${ethers.formatUnits(myBalance, decimals)} ${symbol}`);

  if (myBalance < totalAmount) {
    console.log(colors.red + `🚨 ERROR: Fondos insuficientes de ${symbol}. Necesitas ${formattedTotal} y tienes ${ethers.formatUnits(myBalance, decimals)}.` + colors.reset);
    return;
  }

  const allowance = await tokenContract.allowance(wallet.address, BATCH_TRANSFER_ADDRESS);
  console.log(`- Aprobación actual:    ${ethers.formatUnits(allowance, decimals)} ${symbol}`);

  // 5. Manejar transacción de aprobación si es necesario
  if (allowance < totalAmount) {
    console.log(colors.yellow + `\nAprobación insuficiente. Solicitando aprobación por ${formattedTotal} ${symbol} al contrato BatchTransfer...` + colors.reset);
    console.log(colors.cyan + "Enviando transacción de aprobación..." + colors.reset);
    try {
      const txApprove = await tokenContract.approve(BATCH_TRANSFER_ADDRESS, totalAmount);
      console.log(colors.dim + `Hash de Tx de Aprobación: ${txApprove.hash}` + colors.reset);
      console.log("Esperando confirmación en la red...");
      await txApprove.wait();
      console.log(colors.green + "✓ Aprobación confirmada con éxito!\n" + colors.reset);
    } catch (error) {
      console.log(colors.red + "🚨 Falló la transacción de aprobación: " + error.message + colors.reset);
      return;
    }
  }

  // 6. Enviar transferencia por lotes
  console.log(colors.cyan + "\nEnviando transferencia por lotes..." + colors.reset);
  const batchContract = new ethers.Contract(BATCH_TRANSFER_ADDRESS, BATCH_TRANSFER_ABI, wallet);

  try {
    const txBatch = await batchContract.batchTransfer(TOKEN_ADDRESS, amountPerRecipient, RECIPIENTS);
    console.log(colors.dim + `Hash de Tx de Lote: ${txBatch.hash}` + colors.reset);
    console.log("Esperando confirmación de la red...");
    const receipt = await txBatch.wait();

    console.log(colors.green + colors.bright + "\n🎉 ¡TRANSFERENCIA POR LOTES COMPLETADA CON ÉXITO! 🎉" + colors.reset);
    console.log(`Transacción de Etherscan: ${colors.cyan}https://sepolia.etherscan.io/tx/${txBatch.hash}${colors.reset}`);
  } catch (error) {
    console.log(colors.red + "🚨 Falló la transferencia por lotes: " + error.message + colors.reset);
  }
}

main().catch(err => {
  console.error("Error inesperado:", err);
});
