# 📈 Obtener Métricas y Eventos de la Plataforma (CLI) - Diplomado USACH

Este directorio contiene un script automatizado para la línea de comandos (CLI) diseñado para recopilar, indexar e interpretar toda la actividad histórica registrada en la blockchain de los contratos inteligentes del Diplomado de la Universidad de Santiago de Chile (USACH).

Este script permite dar visibilidad de uso de la plataforma a alumnos y administradores antes del cierre de los laboratorios.

---

## 🚀 Cómo Ejecutar la Herramienta

Asegúrate de estar en el directorio raíz del proyecto y tener las dependencias instaladas (`npm install`). Puedes ejecutar el script tanto contra la red local (localhost) como contra la red de pruebas pública (Sepolia) según convenga.

### Opción 1: Ejecutar contra la red Sepolia (Recomendado)
Para obtener los datos acumulados reales del diplomado:
```bash
npx hardhat run commands/metricas-plataforma.js --network sepolia
```

### Opción 2: Ejecutar contra el entorno local (localhost)
Si tienes el nodo local corriendo (`npx hardhat node`):
```bash
npx hardhat run commands/metricas-plataforma.js --network localhost
```

---

## 📄 Archivo de Reporte Generado

Una vez finalizada la consulta, el script generará automáticamente un archivo Markdown en la raíz del repositorio llamado:
`metricas_plataforma.md`

Este reporte contendrá un desglose clasificado que incluye:
1. **Resumen de Actividad**: Número total de eventos emitidos y estimaciones de transacciones de cada contrato base.
2. **Estadísticas de Identidad**: Cantidad de perfiles de estudiantes registrados, nombres de usuario y detalles de actualización.
3. **Distribución de Insignias (NFTs)**: Un desglose completo de cuántas reliquias de la Escuela de Artes y Oficios (EAO) del `ID 0` al `ID 9` se han acuñado.
4. **Liquidez del DEX**: Detalle de piscinas creadas en `DEXFactory`, reservas de tokens y conteo de operaciones (`swap`, `agregarLiquidez`, `removerLiquidez`).
5. **Tokens Personalizados**: Seguimiento de los tokens ERC-20 creados mediante `TokenFactory` por los alumnos y su volumen de suministro.
6. **Métricas de Infraestructura**: Volumen de envoltura en `WETH` y recuento de lotes masivos de `BatchTransfer`.

---

## 🛠️ Detalles de Implementación Técnica

*   **Ethers.js (v6)**: La lectura del estado de la cadena y filtros de logs se realiza utilizando la API nativa de Ethers.js.
*   **Consulta por Bloques Divididos (Chunking)**: Dado que los nodos RPC públicos aplican límites estrictos sobre la cantidad de bloques o logs consultados en un solo llamado, el script implementa un algoritmo de segmentación en lotes de 10,000 bloques. En caso de fallar por límites del nodo, el lote se subdivide dinámicamente en rangos de 2,000 bloques de manera recursiva para asegurar la recolección de los datos sin caídas.
*   **Seguimiento Dinámico de Contratos**: El script primero recupera las direcciones creadas dinámicamente a través de los eventos de fábrica (`PoolCreado` en `DEXFactory` y `TokenCreated` en `TokenFactory`). A partir de esas direcciones recopiladas, procede a consultar sus respectivos sub-eventos de forma dinámica.
*   **Contador Real de Transacciones**: Si se ejecuta sobre Sepolia y se dispone de un valor configurado en `ETHERSCAN_API_KEY` dentro del archivo `.env`, el script realizará solicitudes HTTP a la API oficial de Etherscan para retornar la cantidad de transacciones reales recibidas por los contratos en lugar de solo estimaciones basadas en la cantidad de eventos emitidos.
