#!/usr/bin/env node

/**
 * Script Educativo sobre Hashing en Web3 y Ethereum
 * Desarrollado para el Diplomado en dApps de la USACH.
 * 
 * Este script interactivo demuestra cómo funcionan los algoritmos de hash
 * (Keccak-256 y SHA-256) en el ecosistema Ethereum usando la librería ethers.js (v6).
 * 
 * Regla del repositorio: Toda documentación, escritura y comentarios están en ESPAÑOL.
 */

const { ethers } = require("ethers");
const readline = require("readline");

// Interfaz para entrada/salida por consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Códigos de colores ANSI para mejorar la estética de la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  bgDarkGray: "\x1b[100m"
};

// Función auxiliar para solicitar datos al usuario mediante Promesas
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(colors.cyan + question + colors.reset, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Limpiar consola
function clearConsole() {
  console.clear();
}

// Dibujar banner principal
function printBanner() {
  console.log(colors.magenta + colors.bright + "=========================================================" + colors.reset);
  console.log(colors.magenta + colors.bright + "   🎓 TALLER INTERACTIVO DE HASHING - DIPLOMADO USACH 🎓" + colors.reset);
  console.log(colors.magenta + colors.bright + "=========================================================" + colors.reset);
  console.log(colors.dim + "Aprende cómo funcionan los hashes en Ethereum usando Ethers.js v6" + colors.reset + "\n");
}

// Opción 1: Keccak-256
async function demoKeccak256() {
  clearConsole();
  printBanner();
  console.log(colors.yellow + "--- Opción 1: Calcular Hash Keccak-256 (Estándar Ethereum) ---" + colors.reset);
  console.log("Keccak-256 es la función criptográfica de hash por defecto en la EVM (Solidity).");
  console.log("Nota: Aunque a veces se confunde con el estándar SHA-3, Keccak-256 difiere");
  console.log("ligeramente debido al relleno (padding) final interno del algoritmo.\n");

  const texto = await prompt("Ingresa el texto a hashear: ");
  if (!texto) {
    console.log(colors.red + "⚠️ Entrada vacía. Operación cancelada." + colors.reset);
    await prompt("\nPresiona Enter para continuar...");
    return;
  }

  // Convertimos el string a un array de bytes UTF-8
  const bytes = ethers.toUtf8Bytes(texto);
  
  // ethers.keccak256 recibe la representación de bytes (array o string hex)
  const hashKeccak = ethers.keccak256(bytes);
  
  // ethers.id es un helper directo de Ethers v6 que realiza ambas acciones sobre un string
  const hashId = ethers.id(texto);

  console.log("\n" + colors.green + "Resultados:" + colors.reset);
  console.log(`- Texto de entrada: "${colors.bright}${texto}${colors.reset}"`);
  console.log(`- Bytes (UTF-8):    ${colors.dim}[${bytes.join(", ")}]${colors.reset}`);
  console.log(`- Bytes (Hex):      ${colors.dim}${ethers.hexlify(bytes)}${colors.reset}`);
  console.log(`- Hash (Keccak256): ${colors.bright}${colors.cyan}${hashKeccak}${colors.reset}`);
  console.log(`- Hash (ethers.id): ${colors.bright}${colors.cyan}${hashId}${colors.reset} (Helper directo para strings)`);
  
  console.log("\n" + colors.yellow + "💡 Explicación Técnica:" + colors.reset);
  console.log("1. El string ingresado es traducido a una secuencia de bytes UTF-8.");
  console.log("2. La función de hash procesa esta secuencia binaria y genera una salida de 256 bits.");
  console.log("3. En Ethereum y Web3, el resultado se muestra como un string hexadecimal de 64 caracteres");
  console.log("   precedido por '0x', lo que representa un valor de 32 bytes (256 bits).");
  console.log("4. `ethers.id(texto)` nos permite ahorrar el paso de conversión manual a bytes.");

  await prompt("\nPresiona Enter para continuar...");
}

// Opción 2: SHA-256
async function demoSha256() {
  clearConsole();
  printBanner();
  console.log(colors.yellow + "--- Opción 2: Calcular Hash SHA-256 (Estándar Común) ---" + colors.reset);
  console.log("SHA-256 es muy popular en otras blockchains como Bitcoin.");
  console.log("En Ethereum, existe una precompilación de soporte para SHA-256, pero usarla");
  console.log("en Smart Contracts cuesta más gas que el opcode nativo de Keccak-256.\n");

  const texto = await prompt("Ingresa el texto a hashear: ");
  if (!texto) {
    console.log(colors.red + "⚠️ Entrada vacía. Operación cancelada." + colors.reset);
    await prompt("\nPresiona Enter para continuar...");
    return;
  }

  const bytes = ethers.toUtf8Bytes(texto);
  const hashSha = ethers.sha256(bytes);
  const hashKeccak = ethers.keccak256(bytes);

  console.log("\n" + colors.green + "Resultados:" + colors.reset);
  console.log(`- Texto de entrada: "${colors.bright}${texto}${colors.reset}"`);
  console.log(`- Hash (SHA-256):   ${colors.bright}${colors.cyan}${hashSha}${colors.reset}`);
  console.log(`- Hash (Keccak256): ${colors.dim}${hashKeccak}${colors.reset} (Para comparación)`);
  
  console.log("\n" + colors.yellow + "💡 Explicación Técnica:" + colors.reset);
  console.log("A pesar de que tanto Keccak-256 como SHA-256 producen un hash del mismo tamaño (32 bytes),");
  console.log("el algoritmo matemático interno es distinto. SHA-256 es parte de la familia SHA-2 de la NSA,");
  console.log("mientras que Keccak-256 fue diseñado por un equipo independiente y se convirtió en la base de SHA-3.");

  await prompt("\nPresiona Enter para continuar...");
}

// Opción 3: Solidity Packed Hashing (y colisiones)
async function demoPackedCollision() {
  clearConsole();
  printBanner();
  console.log(colors.yellow + "--- Opción 3: Solidity Packed Hashing y Colisiones ---" + colors.reset);
  console.log("En Solidity, `keccak256(abi.encodePacked(a, b))` compacta los parámetros de entrada");
  console.log("eliminando el relleno (padding) de bytes antes de aplicar la función hash.");
  console.log("Si dos o más de estos parámetros son de tipo dinámico (como string) y consecutivos,");
  console.log("esto puede crear colisiones accidentales o maliciosas.\n");

  console.log(colors.yellow + "¡Probemos una colisión interactiva!" + colors.reset);
  console.log("A continuación, ingresa dos pares de valores distintos para ver si producen el mismo hash.\n");
  
  console.log(colors.bright + "--- Intento 1 ---" + colors.reset);
  const a1 = await prompt("Ingresa Valor A: ");
  const b1 = await prompt("Ingresa Valor B: ");
  
  console.log("\n" + colors.bright + "--- Intento 2 (Prueba algo distinto, ej: mueve caracteres de A a B) ---" + colors.reset);
  const a2 = await prompt("Ingresa Valor A: ");
  const b2 = await prompt("Ingresa Valor B: ");

  // ethers.solidityPacked equivale al empaquetamiento que hace abi.encodePacked
  const packed1 = ethers.solidityPacked(["string", "string"], [a1, b1]);
  const hash1 = ethers.solidityPackedKeccak256(["string", "string"], [a1, b1]);
  
  const packed2 = ethers.solidityPacked(["string", "string"], [a2, b2]);
  const hash2 = ethers.solidityPackedKeccak256(["string", "string"], [a2, b2]);

  console.log("\n" + colors.green + "Resultados Comparativos:" + colors.reset);
  console.log(colors.bright + "Intento 1:" + colors.reset);
  console.log(`- Entradas:       A = "${colors.cyan}${a1}${colors.reset}", B = "${colors.cyan}${b1}${colors.reset}"`);
  console.log(`- bytes compactos:${colors.dim} ${packed1}${colors.reset}`);
  console.log(`- Hash Resultante: ${colors.bright}${hash1}${colors.reset}`);
  
  console.log(colors.bright + "\nIntento 2:" + colors.reset);
  console.log(`- Entradas:       A = "${colors.cyan}${a2}${colors.reset}", B = "${colors.cyan}${b2}${colors.reset}"`);
  console.log(`- bytes compactos:${colors.dim} ${packed2}${colors.reset}`);
  console.log(`- Hash Resultante: ${colors.bright}${hash2}${colors.reset}`);

  console.log("\n" + colors.bright + "Resultado de la Comparación:" + colors.reset);
  if (hash1 === hash2) {
    if (a1 === a2 && b1 === b2) {
      console.log(colors.green + "✅ Los hashes coinciden porque ingresaste exactamente los mismos valores." + colors.reset);
    } else {
      console.log(colors.red + "🚨 ¡COLISIÓN DETECTADA CON ÉXITO! 🚨" + colors.reset);
      console.log("¡Las entradas son diferentes, pero generaron la misma secuencia compacta y el mismo hash!");
      console.log(`Ambos pares se concatenaron como los mismos bytes: "${colors.yellow}${packed1}${colors.reset}"`);
    }
  } else {
    console.log(colors.green + "✓ Los hashes son diferentes. No hubo colisión." + colors.reset);
    console.log(colors.dim + "💡 Pista para colisión: Intenta con:\n  Intento 1: A = 'AAA', B = 'BBB'\n  Intento 2: A = 'AA', B = 'ABBB'" + colors.reset);
  }

  console.log("\n" + colors.yellow + "🛡️ ¿Cómo se previene esto en Solidity?" + colors.reset);
  console.log("1. Evita usar múltiples parámetros de longitud dinámica consecutivos en `abi.encodePacked`.");
  console.log("2. Utiliza `abi.encode` en su lugar. Éste añade relleno a 32 bytes de forma obligatoria,");
  console.log("   haciendo imposible la colisión por mezcla de caracteres.");
  console.log("3. Si debes usar `abi.encodePacked`, añade un carácter delimitador (como un guión '_')");
  console.log("   entre los parámetros dinámicos para evitar que se fusionen.");

  await prompt("\nPresiona Enter para continuar...");
}

// Opción 4: Function Selector (Method ID)
async function demoFunctionSelector() {
  clearConsole();
  printBanner();
  console.log(colors.yellow + "--- Opción 4: Cálculo de Selectores de Funciones (Method ID) ---" + colors.reset);
  console.log("La EVM no entiende nombres de funciones en lenguaje humano al ejecutar contratos.");
  console.log("En su lugar, utiliza el 'Method ID' o 'Selector' de la función, que consiste en");
  console.log("los primeros 4 bytes del hash Keccak-256 de su firma canónica (ej: 'transfer(address,uint256)').\n");

  console.log("Ejemplos comunes de firmas:");
  console.log("- transfer(address,uint256)");
  console.log("- balanceOf(address)");
  console.log("- approve(address,uint256)");
  console.log(colors.dim + "(Nota: Las firmas canónicas no deben incluir espacios ni nombres de variables. Solo tipo.)" + colors.reset + "\n");

  const firma = await prompt("Ingresa la firma de la función: ");
  if (!firma) {
    console.log(colors.red + "⚠️ Entrada vacía. Operación cancelada." + colors.reset);
    await prompt("\nPresiona Enter para continuar...");
    return;
  }

  if (firma.includes(" ")) {
    console.log(colors.red + "⚠️ Advertencia: La firma contiene espacios. Esto generará un selector inválido en Solidity." + colors.reset);
    console.log("Por favor escribe la firma de la forma 'nombre(tipo1,tipo2)' sin espacios.\n");
  }

  // Calculamos el hash de la firma
  const hash = ethers.id(firma);
  // Los primeros 4 bytes corresponden a los primeros 8 caracteres hexadecimales después del '0x'
  const selector = hash.substring(0, 10);

  console.log("\n" + colors.green + "Resultados:" + colors.reset);
  console.log(`- Firma Canónica:  "${colors.bright}${firma}${colors.reset}"`);
  console.log(`- Hash Completo:    ${colors.dim}${hash}${colors.reset}`);
  console.log(`- Selector (4B):    ${colors.bright}${colors.green}${selector}${colors.reset}`);

  console.log("\n" + colors.yellow + "💡 Explicación Técnica:" + colors.reset);
  console.log("Cuando se envía una transacción para llamar a una función en un Smart Contract,");
  console.log(`los primeros 4 bytes de los datos de la transacción ('calldata') serán exactamente '${colors.green}${selector}${colors.reset}'.`);
  console.log("La EVM usa esto dentro del contrato en una tabla de enrutamiento switch/jump.");

  await prompt("\nPresiona Enter para continuar...");
}

// Opción 5: Propiedades del Hash (Efecto Avalancha)
async function demoAvalancheEffect() {
  clearConsole();
  printBanner();
  console.log(colors.yellow + "--- Opción 5: Propiedades del Hash (Efecto Avalancha) ---" + colors.reset);
  console.log("Una propiedad fundamental de las funciones hash criptográficas es que un cambio mínimo");
  console.log("(de un solo bit o letra) en el texto de entrada debe cambiar por completo el hash.");
  console.log("Esto previene deducir la entrada mediante el análisis de cambios o patrones en la salida.\n");

  const texto1 = await prompt("Ingresa el Primer Texto (ej: 'Diplomado Usach'): ");
  const texto2 = await prompt("Ingresa el Segundo Texto (ej: 'Diplomado usach'): ");

  if (!texto1 || !texto2) {
    console.log(colors.red + "⚠️ Ambas entradas son obligatorias. Operación cancelada." + colors.reset);
    await prompt("\nPresiona Enter para continuar...");
    return;
  }

  const hash1 = ethers.id(texto1);
  const hash2 = ethers.id(texto2);

  console.log("\n" + colors.green + "Comparación de Resultados:" + colors.reset);
  console.log(`Texto 1: "${colors.bright}${texto1}${colors.reset}"`);
  console.log(`Hash 1:  ${colors.cyan}${hash1}${colors.reset}\n`);
  
  console.log(`Texto 2: "${colors.bright}${texto2}${colors.reset}"`);
  console.log(`Hash 2:  ${colors.cyan}${hash2}${colors.reset}\n`);

  // Calculamos el porcentaje de caracteres que coinciden exactamente en posición
  let coincidencias = 0;
  const h1 = hash1.substring(2);
  const h2 = hash2.substring(2);
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] === h2[i]) coincidencias++;
  }
  const porcentaje = ((coincidencias / h1.length) * 100).toFixed(2);

  console.log(`- Caracteres idénticos en la misma posición: ${coincidencias} de ${h1.length} (${porcentaje}%)`);
  
  console.log("\n" + colors.yellow + "💡 Explicación Técnica:" + colors.reset);
  console.log("Observa cómo los dos hashes no guardan ninguna correlación visual, a pesar de que");
  console.log("los textos son prácticamente idénticos. Esto se conoce como efecto avalancha y es");
  console.log("esencial para garantizar la seguridad criptográfica y la resistencia a preimágenes.");

  await prompt("\nPresiona Enter para continuar...");
}

// Bucle principal
async function main() {
  let exit = false;
  while (!exit) {
    clearConsole();
    printBanner();
    
    console.log(colors.bright + "Selecciona una opción para comenzar:" + colors.reset);
    console.log(`[${colors.cyan}1${colors.reset}] Calcular Hash Keccak-256 (Ethereum)`);
    console.log(`[${colors.cyan}2${colors.reset}] Calcular Hash SHA-256 (Estándar Común)`);
    console.log(`[${colors.cyan}3${colors.reset}] Demostración de Solidity Packed Hashing (y Colisiones)`);
    console.log(`[${colors.cyan}4${colors.reset}] Cálculo de Selectores de Funciones (Method ID)`);
    console.log(`[${colors.cyan}5${colors.reset}] Propiedades del Hash (Efecto Avalancha)`);
    console.log(`[${colors.cyan}0${colors.reset}] Salir del Taller`);
    console.log("");

    const opcion = await prompt("Opción > ");

    switch (opcion) {
      case "1":
        await demoKeccak256();
        break;
      case "2":
        await demoSha256();
        break;
      case "3":
        await demoPackedCollision();
        break;
      case "4":
        await demoFunctionSelector();
        break;
      case "5":
        await demoAvalancheEffect();
        break;
      case "0":
        exit = true;
        clearConsole();
        console.log(colors.green + colors.bright + "¡Gracias por participar en el taller de hashing del Diplomado USACH! ¡Hasta pronto!" + colors.reset + "\n");
        break;
      default:
        console.log(colors.red + "⚠️ Opción inválida. Por favor, selecciona una del menú." + colors.reset);
        await prompt("\nPresiona Enter para continuar...");
        break;
    }
  }
  rl.close();
}

main().catch((err) => {
  console.error("Error crítico durante la ejecución del taller:", err);
  rl.close();
});
