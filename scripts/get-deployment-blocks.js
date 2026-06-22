const hre = require("hardhat");

async function main() {
  const txs = {
    StudentIdentity: "0xf2b1edd45b97629512e5fb519936466786e5d6135e07511c5aa968c40f10645d",
    TokenFactory: "0x3bcc16c5dc5512c566525b6f3850bb5133ff691198dcbae7b35e993936791d72",
    BaseERC1155: "0xcdb09e648974448d8fa2dc2edeb5113fe05746377a5aaaf4e0642608df6183db",
    DEXFactory: "0x3fb045aaf2617146536cca9d9a45452c53b5393f83d2acf4350d385a715f6c62",
    WETH: "0xefaab4f239fa40fe26d4a05b318cb3afb4cd8a6da6c76c31a9aa4bbf27224f94",
    ChallengeMinter: "0xeb2cbcb2f54b7ed509c6abac3862e0672fcc1874aec68d05d319d9598402252b",
    BatchTransfer: "0xcef3bb5872b09c427b3ec68759655e05888e92edcc7eb3abccd14943010363b9"
  };

  const provider = hre.ethers.provider;
  const currentBlock = await provider.getBlockNumber();
  console.log("Bloque actual en Sepolia:", currentBlock);

  for (const [name, txHash] of Object.entries(txs)) {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        console.log(`${name}: Bloque ${receipt.blockNumber} (Hace ${currentBlock - receipt.blockNumber} bloques)`);
      } else {
        console.log(`${name}: No se encontró recibo de transacción para ${txHash}`);
      }
    } catch (e) {
      console.error(`Error al obtener recibo para ${name}:`, e.message);
    }
  }
}

main().catch(console.error);
