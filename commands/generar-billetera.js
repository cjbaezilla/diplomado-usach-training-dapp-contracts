#!/usr/bin/env node

// Importar ethers desde las dependencias del proyecto
const { ethers } = require("ethers");

/**
 * Script para generar una nueva dirección de Ethereum (billetera) de forma aleatoria,
 * mostrando su dirección pública, su llave privada y su frase mnemónica.
 */
function generarBilletera() {
  console.log("=== Generador de Billeteras Ethereum ===");
  console.log("Generando una nueva billetera aleatoria...\n");

  // Crear una billetera aleatoria usando ethers v6
  const wallet = ethers.Wallet.createRandom();

  console.log("Dirección Pública:");
  console.log(`🔑 ${wallet.address}`);
  console.log("\nLlave Privada (Private Key):");
  console.log(`🔒 ${wallet.privateKey}`);
  
  if (wallet.mnemonic) {
    console.log("\nFrase Mnemónica (Mnemonic Phrase):");
    console.log(`📝 ${wallet.mnemonic.phrase}`);
  }
  
  console.log("\n========================================");
  console.log("⚠️ ¡ATENCIÓN!: Guarda la llave privada y la frase mnemónica en un lugar seguro.");
  console.log("Nunca compartas tu llave privada con nadie. Cualquiera que la tenga podrá controlar tus fondos.");
  console.log("========================================");
}

generarBilletera();
