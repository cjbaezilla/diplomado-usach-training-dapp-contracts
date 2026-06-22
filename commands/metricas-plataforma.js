#!/usr/bin/env node
/*
=============================================================================
🛠️ Script de Métricas On-chain - Diplomado USACH
=============================================================================
Este script consulta todos los eventos históricos emitidos por los contratos
inteligentes del Diplomado USACH, calcula estadísticas de uso, rastrea pools
de liquidez y tokens creados dinámicamente, y genera un reporte en formato
Markdown.

Uso:
  npx hardhat run commands/metricas-plataforma.js --network sepolia
  npx hardhat run commands/metricas-plataforma.js --network localhost
=============================================================================
*/

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Bloques de despliegue predeterminados en Sepolia para agilizar las consultas de eventos
const SEPOLIA_DEPLOYMENT_BLOCKS = {
  StudentIdentity: 10968599,
  TokenFactory: 10968607,
  BaseERC1155: 10968614,
  DEXFactory: 10968621,
  WETH: 10968628,
  ChallengeMinter: 10971714,
  BatchTransfer: 11053996
};

// Función auxiliar para pausar la ejecución y evitar límites de tasa (rate limiting)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función auxiliar para formatear montos grandes de tokens (18 decimales por defecto)
function formatUnits(value, decimals = 18) {
  return hre.ethers.formatUnits(value, decimals);
}

// Consulta de logs históricos utilizando la API V2 de Etherscan (Sepolia) para evitar restricciones de nodos RPC
async function getEventsEtherscan(contractInstance, address, fromBlock, chainId, apiKey) {
  let retries = 3;
  while (retries > 0) {
    await sleep(250); // Pausa preventiva de 250ms (máx 4 peticiones por segundo)
    try {
      const url = `https://api.etherscan.io/v2/api?chainid=${chainId.toString()}&module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=latest&address=${address}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Controlar el límite de tasa devuelto por Etherscan
      if (data.status === "0" && data.result && typeof data.result === "string" && data.result.includes("Max rate limit reached")) {
        console.warn(`    ⚠️ Límite de tasa de Etherscan alcanzado. Reintentando en 2 segundos...`);
        await sleep(2000);
        retries--;
        continue;
      }

      if (data.status !== "1" || !data.result) {
        if (data.message === "No records found") {
          return [];
        }
        throw new Error(data.message || "Error al llamar a la API de Etherscan");
      }
      
      const interface = contractInstance.interface;
      return data.result.map(log => {
        try {
          const parsedLog = interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          return {
            fragment: parsedLog.fragment,
            name: parsedLog.name,
            args: parsedLog.args,
            transactionHash: log.transactionHash,
            blockNumber: parseInt(log.blockNumber, 16),
            logIndex: parseInt(log.logIndex, 16)
          };
        } catch (e) {
          // Ignorar eventos de otros contratos heredados
          return null;
        }
      }).filter(Boolean);
    } catch (e) {
      if (retries === 1) throw e;
      console.warn(`    ⚠️ Error al consultar Etherscan. Reintentando en 1.5s... (${e.message})`);
      await sleep(1500);
      retries--;
    }
  }
  return [];
}

// Función de consulta robusta de respaldo vía RPC dividida en sub-bloques
async function queryEventsRobust(contractInstance, fromBlock, toBlock) {
  const chunkSize = 10000;
  let allEvents = [];
  
  for (let currentFrom = fromBlock; currentFrom <= toBlock; currentFrom += chunkSize) {
    const currentTo = Math.min(currentFrom + chunkSize - 1, toBlock);
    try {
      const events = await contractInstance.queryFilter("*", currentFrom, currentTo);
      allEvents = allEvents.concat(events);
    } catch (error) {
      const subChunkSize = 2000;
      for (let subFrom = currentFrom; subFrom <= currentTo; subFrom += subChunkSize) {
        const subTo = Math.min(subFrom + subChunkSize - 1, currentTo);
        try {
          const events = await contractInstance.queryFilter("*", subFrom, subTo);
          allEvents = allEvents.concat(events);
        } catch (subError) {
          console.error(`❌ Error consultando logs vía RPC en bloques ${subFrom}-${subTo}:`, subError.message);
        }
      }
    }
  }
  return allEvents;
}

// Función para obtener la lista de transacciones normales desde Etherscan API V2
async function fetchTransactionsFromEtherscan(address, startBlock, chainId, apiKey) {
  if (!apiKey || apiKey === "") return null;
  let retries = 3;
  while (retries > 0) {
    await sleep(250); // Pausa preventiva
    try {
      const url = `https://api.etherscan.io/v2/api?chainid=${chainId.toString()}&module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=latest&sort=asc&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "0" && data.result && typeof data.result === "string" && data.result.includes("Max rate limit reached")) {
        console.warn(`    ⚠️ Límite de tasa de Etherscan alcanzado (txlist). Reintentando en 2 segundos...`);
        await sleep(2000);
        retries--;
        continue;
      }

      if (data.status === "1" && data.result) {
        return data.result;
      }
      return null;
    } catch (error) {
      if (retries === 1) {
        console.warn(`[Advertencia] No se pudo consultar Etherscan para ${address}:`, error.message);
        return null;
      }
      await sleep(1500);
      retries--;
    }
  }
  return null;
}

async function main() {
  console.log("=== 🔍 INICIANDO RECOPILACIÓN DE MÉTRICAS ON-CHAIN ===");

  const provider = hre.ethers.provider;
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const networkName = hre.network.name;
  
  console.log(`Conectado a la red: ${networkName} (Chain ID: ${chainId})`);

  // 1. Cargar las direcciones desplegadas
  let deployJsonPath = "";
  let startBlocks = {};
  const currentBlock = await provider.getBlockNumber();
  console.log("Bloque actual en la red:", currentBlock);

  if (chainId === 11155111n) {
    deployJsonPath = path.join(__dirname, "../ignition/deployments/chain-11155111/deployed_addresses.json");
    startBlocks = { ...SEPOLIA_DEPLOYMENT_BLOCKS };
  } else if (chainId === 31337n) {
    deployJsonPath = path.join(__dirname, "../ignition/deployments/chain-31337/deployed_addresses.json");
    startBlocks = {
      StudentIdentity: 0,
      TokenFactory: 0,
      BaseERC1155: 0,
      DEXFactory: 0,
      WETH: 0,
      ChallengeMinter: 0,
      BatchTransfer: 0
    };
  } else {
    console.error("❌ Red no soportada. Este script solo soporta Sepolia (11155111) y Localhost (31337).");
    process.exit(1);
  }

  if (!fs.existsSync(deployJsonPath)) {
    console.error(`❌ No se encontró el archivo de direcciones en: ${deployJsonPath}`);
    process.exit(1);
  }

  const deployedAddresses = JSON.parse(fs.readFileSync(deployJsonPath, "utf8"));
  const apiKey = process.env.ETHERSCAN_API_KEY || "";

  // Reporte final estructurado
  const reportData = {
    networkName,
    chainId: chainId.toString(),
    currentBlock,
    timestamp: new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" }),
    contracts: {}
  };

  let poolsCreados = [];
  let tokensCreados = [];

  // Mapear los contratos y sus módulos
  const contractMapping = {
    StudentIdentity: "StudentIdentityModule#StudentIdentity",
    TokenFactory: "TokenFactoryModule#TokenFactory",
    BaseERC1155: "BaseERC1155Module#BaseERC1155",
    DEXFactory: "DEXModule#DEXFactory",
    WETH: "WETHModule#WETH",
    ChallengeMinter: "ChallengeMinterModule#ChallengeMinter",
    BatchTransfer: "BatchTransferModule#BatchTransfer"
  };

  for (const [contractName, keyName] of Object.entries(contractMapping)) {
    const address = deployedAddresses[keyName];
    if (!address) {
      console.log(`⚠️ Contrato ${contractName} no desplegado en esta red. Omitiendo.`);
      continue;
    }

    const startBlock = startBlocks[contractName] || 0;
    console.log(`\nAnalizando ${contractName} en ${address}...`);

    // Intentar obtener transacciones desde Etherscan (Sepolia)
    let txs = null;
    if (chainId === 11155111n && apiKey) {
      console.log(`  Consultando transacciones en Etherscan para ${contractName}...`);
      txs = await fetchTransactionsFromEtherscan(address, startBlock, chainId, apiKey);
    }

    let contractInstance;
    let events = [];
    try {
      contractInstance = await hre.ethers.getContractAt(contractName, address);
      if (chainId === 11155111n && apiKey) {
        try {
          console.log(`  Consultando logs en Etherscan para ${contractName}...`);
          events = await getEventsEtherscan(contractInstance, address, startBlock, chainId, apiKey);
        } catch (etherscanError) {
          console.warn(`  [Advertencia] Falló consulta Etherscan para ${contractName}: ${etherscanError.message}. Reintentando vía RPC...`);
          events = await queryEventsRobust(contractInstance, startBlock, currentBlock);
        }
      } else {
        events = await queryEventsRobust(contractInstance, startBlock, currentBlock);
      }
      console.log(`  ✔ Eventos encontrados: ${events.length}`);
    } catch (e) {
      console.error(`  ❌ Error al obtener eventos en ${contractName}:`, e.message);
      continue;
    }

    const uniqueTxHashes = new Set(events.map(ev => ev.transactionHash));
    
    reportData.contracts[contractName] = {
      address,
      startBlock,
      totalEvents: events.length,
      estimatedTransactions: uniqueTxHashes.size,
      realTransactions: txs ? txs.length : null,
      activeUsers: txs ? new Set(txs.map(t => t.from)).size : new Set(events.map(ev => ev.args ? ev.args[0] : null).filter(Boolean)).size,
      events: {}
    };

    // Agrupar eventos
    events.forEach(ev => {
      const eventName = ev.name || "Desconocido";
      if (!reportData.contracts[contractName].events[eventName]) {
        reportData.contracts[contractName].events[eventName] = {
          count: 0,
          list: []
        };
      }
      reportData.contracts[contractName].events[eventName].count++;
      
      let details = {};
      if (ev.args) {
        ev.fragment.inputs.forEach((input, index) => {
          let argVal = ev.args[index];
          if (typeof argVal === "bigint") {
            argVal = argVal.toString();
          }
          details[input.name] = argVal;
        });
      }
      reportData.contracts[contractName].events[eventName].list.push({
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        details
      });
    });

    // Registrar pools y tokens dinámicos
    if (contractName === "DEXFactory") {
      const poolCreatedEvents = reportData.contracts[contractName].events["PoolCreado"];
      if (poolCreatedEvents) {
        poolCreatedEvents.list.forEach(evt => {
          poolsCreados.push({
            pool: evt.details.pool,
            token0: evt.details.token0,
            token1: evt.details.token1,
            blockNumber: evt.blockNumber
          });
        });
      }
    }

    if (contractName === "TokenFactory") {
      const tokenCreatedEvents = reportData.contracts[contractName].events["TokenCreated"];
      if (tokenCreatedEvents) {
        tokenCreatedEvents.list.forEach(evt => {
          tokensCreados.push({
            tokenAddress: evt.details.tokenAddress,
            owner: evt.details.owner,
            name: evt.details.name,
            symbol: evt.details.symbol,
            blockNumber: evt.blockNumber
          });
        });
      }
    }
  }

  // ==========================================
  // 🏊 Análisis de Piscinas DEXPool (Dinamicas)
  // ==========================================
  if (poolsCreados.length > 0) {
    console.log(`\n--- Analizando ${poolsCreados.length} Piscinas de Liquidez DEXPool detectadas ---`);
    reportData.pools = [];

    for (const poolInfo of poolsCreados) {
      console.log(`Analizando DEXPool en ${poolInfo.pool}...`);
      let poolContract;
      let poolEvents = [];
      try {
        poolContract = await hre.ethers.getContractAt("DEXPool", poolInfo.pool);
        if (chainId === 11155111n && apiKey) {
          try {
            console.log(`  Consultando logs en Etherscan para DEXPool ${poolInfo.pool}...`);
            poolEvents = await getEventsEtherscan(poolContract, poolInfo.pool, poolInfo.blockNumber, chainId, apiKey);
          } catch (err) {
            console.warn(`  [Advertencia] Falló consulta Etherscan para DEXPool: ${err.message}. Intentando vía RPC...`);
            poolEvents = await queryEventsRobust(poolContract, poolInfo.blockNumber, currentBlock);
          }
        } else {
          poolEvents = await queryEventsRobust(poolContract, poolInfo.blockNumber, currentBlock);
        }
        console.log(`  ✔ Eventos encontrados en pool: ${poolEvents.length}`);
      } catch (e) {
        console.error(`  ❌ Error al consultar piscina ${poolInfo.pool}:`, e.message);
        continue;
      }

      let reserve0 = "0";
      let reserve1 = "0";
      let totalSupplyLP = "0";
      try {
        const res = await poolContract.obtenerReservas();
        reserve0 = res._reserve0.toString();
        reserve1 = res._reserve1.toString();
        totalSupplyLP = (await poolContract.totalSupply()).toString();
      } catch (e) {
        console.warn(`  [Advertencia] No se pudieron leer reservas:`, e.message);
      }

      const uniqueTxHashes = new Set(poolEvents.map(ev => ev.transactionHash));
      const poolReport = {
        address: poolInfo.pool,
        token0: poolInfo.token0,
        token1: poolInfo.token1,
        creationBlock: poolInfo.blockNumber,
        reserve0,
        reserve1,
        totalSupplyLP,
        totalEvents: poolEvents.length,
        estimatedTransactions: uniqueTxHashes.size,
        events: {}
      };

      poolEvents.forEach(ev => {
        const eventName = ev.name || "Desconocido";
        if (!poolReport.events[eventName]) {
          poolReport.events[eventName] = { count: 0, list: [] };
        }
        poolReport.events[eventName].count++;

        let details = {};
        if (ev.args) {
          ev.fragment.inputs.forEach((input, index) => {
            let argVal = ev.args[index];
            if (typeof argVal === "bigint") {
              argVal = argVal.toString();
            }
            details[input.name] = argVal;
          });
        }
        poolReport.events[eventName].list.push({
          txHash: ev.transactionHash,
          blockNumber: ev.blockNumber,
          details
        });
      });

      reportData.pools.push(poolReport);
    }
  }

  // ==========================================
  // 🪙 Análisis de Tokens BaseERC20 Creados
  // ==========================================
  if (tokensCreados.length > 0) {
    console.log(`\n--- Analizando ${tokensCreados.length} Tokens BaseERC20 detectados ---`);
    reportData.tokens = [];

    for (const tokInfo of tokensCreados) {
      console.log(`Analizando ERC20 personalizado en ${tokInfo.tokenAddress} (${tokInfo.symbol})...`);
      let tokenContract;
      let tokenEvents = [];
      try {
        tokenContract = await hre.ethers.getContractAt("BaseERC20", tokInfo.tokenAddress);
        if (chainId === 11155111n && apiKey) {
          try {
            console.log(`  Consultando logs en Etherscan para token ${tokInfo.symbol}...`);
            tokenEvents = await getEventsEtherscan(tokenContract, tokInfo.tokenAddress, tokInfo.blockNumber, chainId, apiKey);
          } catch (err) {
            console.warn(`  [Advertencia] Falló consulta Etherscan para token: ${err.message}. Intentando vía RPC...`);
            tokenEvents = await queryEventsRobust(tokenContract, tokInfo.blockNumber, currentBlock);
          }
        } else {
          tokenEvents = await queryEventsRobust(tokenContract, tokInfo.blockNumber, currentBlock);
        }
        console.log(`  ✔ Eventos encontrados en token: ${tokenEvents.length}`);
      } catch (e) {
        console.error(`  ❌ Error al consultar token ${tokInfo.tokenAddress}:`, e.message);
        continue;
      }

      let totalSupply = "0";
      try {
        totalSupply = (await tokenContract.totalSupply()).toString();
      } catch (e) {
        console.warn(`  [Advertencia] No se pudo leer el suministro del token:`, e.message);
      }

      const uniqueTxHashes = new Set(tokenEvents.map(ev => ev.transactionHash));
      const tokenReport = {
        address: tokInfo.tokenAddress,
        name: tokInfo.name,
        symbol: tokInfo.symbol,
        owner: tokInfo.owner,
        creationBlock: tokInfo.blockNumber,
        totalSupply,
        totalEvents: tokenEvents.length,
        estimatedTransactions: uniqueTxHashes.size,
        events: {}
      };

      tokenEvents.forEach(ev => {
        const eventName = ev.name || "Desconocido";
        if (!tokenReport.events[eventName]) {
          tokenReport.events[eventName] = { count: 0 };
        }
        tokenReport.events[eventName].count++;
      });

      reportData.tokens.push(tokenReport);
    }
  }

  // ==========================================
  // ✍️ Generar Archivo de Salida en Markdown
  // ==========================================
  const markdownContent = buildMarkdownReport(reportData);
  const outPath = path.join(__dirname, "../metricas_plataforma.md");
  fs.writeFileSync(outPath, markdownContent, "utf8");
  console.log(`\n✔ Reporte de métricas generado exitosamente en: ${outPath}`);
  console.log("=== 🔍 FINALIZADA LA RECOPILACIÓN DE MÉTRICAS ===");
}

// Generación del contenido del archivo Markdown
function buildMarkdownReport(data) {
  // Calcular acumulados de tokens personalizados
  let totalTokenEvents = 0;
  let totalTokenTxEst = 0;
  if (data.tokens) {
    data.tokens.forEach(tok => {
      totalTokenEvents += tok.totalEvents;
      totalTokenTxEst += tok.estimatedTransactions;
    });
  }

  // Calcular acumulados de DEX Pools
  let totalPoolEvents = 0;
  let totalPoolTxEst = 0;
  if (data.pools) {
    data.pools.forEach(pool => {
      totalPoolEvents += pool.totalEvents;
      totalPoolTxEst += pool.estimatedTransactions;
    });
  }

  let md = `# 📈 Reporte de Uso de la Plataforma y Métricas On-chain

Generado automáticamente a partir del historial de la cadena de bloques.

- **Red:** \`${data.networkName}\` (Chain ID: \`${data.chainId}\`)
- **Bloque de consulta:** \`${data.currentBlock}\`
- **Fecha de generación:** \`${data.timestamp}\`

---

## 📊 Resumen General de Actividad

| Contrato / Componente | Dirección | Transacciones Totales (Etherscan / Est. Logs) | Eventos Registrados |
| :--- | :--- | :---: | :---: |
`;

  let grandTotalEvents = 0;
  let grandTotalTx = 0;

  for (const [name, contract] of Object.entries(data.contracts)) {
    const txShow = contract.realTransactions !== null ? `**${contract.realTransactions}** (Etherscan)` : `**${contract.estimatedTransactions}** (Est. por logs)`;
    md += `| **${name}** | \`${contract.address}\` | ${txShow} | **${contract.totalEvents}** |\n`;
    
    grandTotalEvents += contract.totalEvents;
    grandTotalTx += contract.realTransactions !== null ? contract.realTransactions : contract.estimatedTransactions;
  }

  // Agregar filas de totales para componentes dinámicos creados por los alumnos
  md += `| **DEX Pools (Agregado - ${data.pools ? data.pools.length : 0} pools)** | *(Múltiples direcciones)* | **${totalPoolTxEst}** (Est. por logs) | **${totalPoolEvents}** |\n`;
  md += `| **Tokens Personalizados (Agregado - ${data.tokens ? data.tokens.length : 0} tokens)** | *(Múltiples direcciones)* | **${totalTokenTxEst}** (Est. por logs) | **${totalTokenEvents}** |\n`;

  // Calcular el gran total sumando los componentes dinámicos
  grandTotalEvents += totalPoolEvents;
  grandTotalTx += totalPoolTxEst;

  grandTotalEvents += totalTokenEvents;
  grandTotalTx += totalTokenTxEst;

  // Agregar fila final de totales generales
  md += `| 📊 **TOTAL GENERAL ACUMULADO** | | 🚀 **${grandTotalTx}** | 🏆 **${grandTotalEvents}** |\n`;

  md += `\n---

## 👥 1. Identidad Estudiantil (StudentIdentity)
`;

  const stdId = data.contracts.StudentIdentity;
  if (stdId) {
    const reg = stdId.events.ProfileRegistered ? stdId.events.ProfileRegistered.count : 0;
    const upd = stdId.events.ProfileUpdated ? stdId.events.ProfileUpdated.count : 0;
    md += `- **Estudiantes Únicos Registrados:** \`${reg}\`
- **Actualizaciones de Perfil Realizadas:** \`${upd}\`
- **Usuarios Únicos Interactuando:** \`${stdId.activeUsers}\`

### Detalle de Estudiantes Registrados:
`;
    if (stdId.events.ProfileRegistered && stdId.events.ProfileRegistered.list.length > 0) {
      md += `\n| Estudiante (Dirección) | Nombre | Email | Bloque | Tx Hash |\n| :--- | :--- | :--- | :---: | :--- |\n`;
      stdId.events.ProfileRegistered.list.forEach(evt => {
        md += `| \`${evt.details.studentAddress}\` | **${evt.details.name}** | \`${evt.details.email}\` | ${evt.blockNumber} | [\`ver tx\`](${getExplorerLink(data.chainId, evt.txHash)}) |\n`;
      });
    } else {
      md += `\n*No hay registros aún.*`;
    }
  } else {
    md += `*Contrato no desplegado o analizado.*`;
  }

  md += `\n---

## 🏆 2. Insignias y Desafíos (BaseERC1155 y ChallengeMinter)
`;

  const erc1155 = data.contracts.BaseERC1155;
  const minter = data.contracts.ChallengeMinter;

  if (erc1155) {
    const totalClaims = minter && minter.events.ChallengeClaimed ? minter.events.ChallengeClaimed.count : 0;
    md += `- **Desafíos Reclamados Exitosamente (vía ChallengeMinter):** \`${totalClaims}\`
- **Total de Acuñaciones de Insignias (vía BaseERC1155):** \`${erc1155.events.TransferSingle ? erc1155.events.TransferSingle.count : 0}\`

### Distribución de Insignias Reclamadas (Por ID de Reliquia):
`;
    const badgeCounts = {};
    if (erc1155.events.TransferSingle) {
      erc1155.events.TransferSingle.list.forEach(evt => {
        const id = evt.details.id;
        badgeCounts[id] = (badgeCounts[id] || 0) + parseInt(evt.details.value || "1");
      });
    }
    if (erc1155.events.TransferBatch) {
      erc1155.events.TransferBatch.list.forEach(evt => {
        const ids = evt.details.ids || [];
        const values = evt.details.values || [];
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          badgeCounts[id] = (badgeCounts[id] || 0) + parseInt(values[i] || "1");
        }
      });
    }

    const nicks = {
      "0": "Insignia #0: El Alambique y Recipiente (Taller de la EAO)",
      "1": "Insignia #1: La Turbina del Patio de Talleres (Legado Industrial)",
      "2": "Insignia #2: El Tablero de Control (Central Eléctrica EAO)",
      "3": "Insignia #3: La Sala de Exhibición (Maestría Industrial de la EAO)",
      "4": "Insignia #4: La Fragua y el Yunque (Taller de Forja de la EAO)",
      "5": "Insignia #5: La Caldera Babcock & Wilcox (Corazón de Vapor de la EAO)",
      "6": "Insignia #6: La Bodega del Laboratorio de Química (El Templo de la Alquimia)",
      "7": "Insignia #7: La Máquina de Vapor Cavé à Paris (El Motor Fundacional)",
      "8": "Insignia #8: La Urna Funeraria del General Las Heras (Maestría en Broncería)",
      "9": "Insignia #9: Los Taladros Mecánicos en Serie (Taller de Mecánica y Ajuste)"
    };

    md += `\n| ID Insignia | Nombre de la Reliquia | Cantidad Acuñada |\n| :---: | :--- | :---: |\n`;
    for (let id = 0; id <= 9; id++) {
      const count = badgeCounts[id.toString()] || 0;
      md += `| \`${id}\` | ${nicks[id.toString()] || "Reliquia Educativa"} | **${count}** |\n`;
    }
  } else {
    md += `*Contratos no analizados.*`;
  }

  md += `\n---

## 💱 3. Liquidez e Intercambios (DEXFactory y DEXPools)
`;

  const dexFactory = data.contracts.DEXFactory;
  if (dexFactory) {
    const poolsCount = data.pools ? data.pools.length : 0;
    md += `- **Piscinas de Liquidez Desplegadas:** \`${poolsCount}\`

### Detalle de Piscinas e Intercambios:
`;
    if (data.pools && data.pools.length > 0) {
      data.pools.forEach(pool => {
        const swaps = pool.events.Swap ? pool.events.Swap.count : 0;
        const addLiq = pool.events.LiquidezAgregada ? pool.events.LiquidezAgregada.count : 0;
        const remLiq = pool.events.LiquidezRemovida ? pool.events.LiquidezRemovida.count : 0;
        
        md += `\n#### 🏊 Pool: \`${pool.address}\`
- **Par:** \`${pool.token0}\` / \`${pool.token1}\`
- **Reservas actuales:** Token0: \`${pool.reserve0}\` \| Token1: \`${pool.reserve1}\`
- **Total LP Emitido:** \`${pool.totalSupplyLP}\`
- **Operaciones:**
  - 🔄 Swaps realizados: **${swaps}**
  - ➕ Aportes de liquidez: **${addLiq}**
  - ➖ Retiros de liquidez: **${remLiq}**
`;
      });
    } else {
      md += `\n*No se han creado piscinas de liquidez aún.*`;
    }
  } else {
    md += `*DEXFactory no analizado.*`;
  }

  md += `\n---

## 💰 4. Actividad de Tokens Creados (TokenFactory y BaseERC20)
`;

  const tokFact = data.contracts.TokenFactory;
  if (tokFact) {
    const tokensCount = data.tokens ? data.tokens.length : 0;
    md += `- **Tokens Personalizados Creados:** \`${tokensCount}\`

### Lista de Tokens Creados y su Suministro:
`;
    if (data.tokens && data.tokens.length > 0) {
      md += `\n| Token (Dirección) | Nombre | Símbolo | Creador (Owner) | Suministro Total | Bloque |\n| :--- | :--- | :---: | :--- | :---: | :---: |\n`;
      data.tokens.forEach(tok => {
        md += `| \`${tok.address}\` | **${tok.name}** | **${tok.symbol}** | \`${tok.owner}\` | ${formatUnits(tok.totalSupply)} | ${tok.creationBlock} |\n`;
      });
    } else {
      md += `\n*No se han creado tokens personalizados todavía.*`;
    }
  } else {
    md += `*TokenFactory no analizado.*`;
  }

  md += `\n---

## 🌊 5. Wrapped Ether (WETH) e Interacciones Masivas (BatchTransfer)
`;

  const weth = data.contracts.WETH;
  const batch = data.contracts.BatchTransfer;

  if (weth) {
    const deps = weth.events.Deposit ? weth.events.Deposit.count : 0;
    const withs = weth.events.Withdrawal ? weth.events.Withdrawal.count : 0;
    md += `### Wrapped Ether (WETH)
- **Operaciones de Depósito (Wrap):** \`${deps}\`
- **Operaciones de Retiro (Unwrap):** \`${withs}\`
`;
  }

  if (batch) {
    const btCount = batch.events.TransferenciaPorLote ? batch.events.TransferenciaPorLote.count : 0;
    let totalBatchTokens = 0n;
    if (batch.events.TransferenciaPorLote) {
      batch.events.TransferenciaPorLote.list.forEach(evt => {
        totalBatchTokens += BigInt(evt.details.cantidadTotal || "0");
      });
    }
    md += `\n### Envío de Tokens por Lote (BatchTransfer)
- **Lotes Enviados:** \`${btCount}\`
- **Total de Tokens Distribuidos:** \`${formatUnits(totalBatchTokens)}\`
`;
  }

  md += `\n---
*Fin del reporte de métricas del Diplomado USACH. Todo el procesamiento se realizó consultando el estado y los eventos directamente de la cadena.*`;

  return md;
}

function getExplorerLink(chainId, txHash) {
  if (chainId === "11155111") {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }
  return `#`;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error en la ejecución:", error);
    process.exit(1);
  });
