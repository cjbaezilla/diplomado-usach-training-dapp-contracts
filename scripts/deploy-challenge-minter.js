const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log("Iniciando despliegue con la cuenta:", deployerAddress);
  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  console.log("Balance del deployer:", hre.ethers.formatEther(balance), "ETH");

  const nftContractAddress = "0x6b727bC4560A05AEEB9c353396395B35c6Fdb57E"; // BaseERC1155 en Sepolia
  const authorizedSignerAddress = "0x12341d05cFEE5c5B4d92616598d3519Ee6C06716"; // Dirección requerida del firmante

  console.log("\n--- Desplegando ChallengeMinter ---");
  console.log("Admin (Deployer):", deployerAddress);
  console.log("Signer Autorizado:", authorizedSignerAddress);
  console.log("NFT BaseERC1155:", nftContractAddress);

  // 1. Desplegar el contrato
  const ChallengeMinter = await hre.ethers.getContractFactory("ChallengeMinter");
  const challengeMinter = await ChallengeMinter.deploy(
    deployerAddress,
    authorizedSignerAddress,
    nftContractAddress
  );

  await challengeMinter.waitForDeployment();
  const challengeMinterAddress = await challengeMinter.getAddress();
  console.log("✔ ChallengeMinter desplegado exitosamente en:", challengeMinterAddress);

  // 2. Otorgar el MINTER_ROLE de BaseERC1155 al nuevo contrato ChallengeMinter
  console.log("\n--- Otorgando MINTER_ROLE en BaseERC1155 ---");
  try {
    const nftContract = await hre.ethers.getContractAt(
      "contracts/BaseERC1155.sol:BaseERC1155",
      nftContractAddress
    );
    const MINTER_ROLE = await nftContract.MINTER_ROLE();
    console.log("Otorgando rol MINTER_ROLE (", MINTER_ROLE, ") a:", challengeMinterAddress);

    const tx = await nftContract.connect(deployer).grantRole(MINTER_ROLE, challengeMinterAddress);
    console.log("Transacción enviada:", tx.hash);
    await tx.wait(1);
    console.log("✔ MINTER_ROLE otorgado exitosamente.");
  } catch (error) {
    console.error("❌ Error al intentar otorgar el MINTER_ROLE. Asegúrate de que el deployer tenga permisos de administración en el contrato NFT:", error.message);
  }

  // 3. Verificar el contrato en Etherscan
  console.log("\n--- Iniciando verificación del contrato en Etherscan ---");
  console.log("Esperando 6 bloques para asegurar la indexación en Etherscan...");
  
  // Esperar confirmaciones del despliegue del contrato
  const deploymentTx = challengeMinter.deploymentTransaction();
  if (deploymentTx) {
    await deploymentTx.wait(6);
  } else {
    // Si no está disponible por alguna razón, esperamos con timeout simulado
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  try {
    await hre.run("verify:verify", {
      address: challengeMinterAddress,
      constructorArguments: [
        deployerAddress,
        authorizedSignerAddress,
        nftContractAddress
      ],
    });
    console.log("✔ Contrato verificado exitosamente en Etherscan.");
  } catch (error) {
    console.error("❌ Error durante la verificación en Etherscan (puede que ya esté verificado o tome más tiempo indexar):", error.message);
  }

  console.log("\nDirección de ChallengeMinter Desplegada:", challengeMinterAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error en el script de despliegue:", error);
    process.exit(1);
  });
