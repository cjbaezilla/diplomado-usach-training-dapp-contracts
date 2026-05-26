# Contratos de la dApp de Entrenamiento - Diplomado USACH

Este repositorio contiene los contratos inteligentes (smart contracts) y el entorno de pruebas para la dApp de entrenamiento del Diplomado de la Universidad de Santiago de Chile (USACH). Está construido utilizando el framework de desarrollo **Hardhat**.

## 📄 Contratos del Proyecto

Actualmente, el proyecto cuenta con los siguientes contratos:

*   **[`BaseERC20.sol`](contracts/BaseERC20.sol)**: Un token ERC-20 estándar y robusto que implementa características modernas de la biblioteca **OpenZeppelin Contracts** (`^5.6.1`), tales como:
    *   **Acuñación y Quema (`ERC20Burnable`, `mint`):** Permite emitir nuevos tokens (restringido al propietario) y destruir existentes.
    *   **Pausabilidad (`ERC20Pausable`):** Permite pausar todas las transferencias de tokens en caso de emergencia.
    *   **Control de Acceso (`Ownable`):** Gestión de propiedad para restringir funciones críticas al propietario.
    *   **Firmas sin Gas (`ERC20Permit`):** Soporte para aprobaciones mediante firmas (EIP-712), mejorando la experiencia del usuario.

*   **[`StudentIdentity.sol`](contracts/StudentIdentity.sol)**: Contrato para gestionar identidades de estudiantes en la cadena, almacenando datos como nombre, email y redes sociales.
    *   **Dirección en red local (localhost):** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

*   **[`TokenFactory.sol`](contracts/TokenFactory.sol)**: Fábrica para crear nuevos tokens `BaseERC20` de forma dinámica y registrar sus propietarios.
    *   **Dirección en red local (localhost):** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

*   **[`BaseERC1155.sol`](contracts/BaseERC1155.sol)**: Contrato de token semi-fungible ERC-1155 con control de acceso por roles, acuñación, quema y soporte para URI dinámica de metadatos.
    *   **Dirección en red local (localhost):** `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
    *   **Insignias de Reliquias Disponibles:**
        0. **ID 0**: Insignia #0: El Alambique y Recipiente (Taller de la EAO)
        1. **ID 1**: Insignia #1: La Turbina del Patio de Talleres (Legado Industrial)
        2. **ID 2**: Insignia #2: El Tablero de Control (Central Eléctrica EAO)
        3. **ID 3**: Insignia #3: La Sala de Exhibición (Maestría Industrial de la EAO)
        4. **ID 4**: Insignia #4: La Fragua y el Yunque (Taller de Forja de la EAO)
        5. **ID 5**: Insignia #5: La Caldera Babcock & Wilcox (Corazón de Vapor de la EAO)
        6. **ID 6**: Insignia #6: La Bodega del Laboratorio de Química (El Templo de la Alquimia EAO)
        7. **ID 7**: Insignia #7: La Máquina de Vapor Cavé à Paris (El Motor Fundacional EAO)
        8. **ID 8**: Insignia #8: La Urna Funeraria del General Las Heras (Maestría en Broncería y Fundición)
        9. **ID 9**: Insignia #9: Los Taladros Mecánicos en Serie (Taller de Mecánica y Ajuste)

*   **[`DEXFactory.sol`](contracts/DEXFactory.sol)**: Fábrica educativa para desplegar y registrar piscinas de liquidez (DEXPool) garantizando la unicidad de los pares.
    *   **Dirección en red local (localhost):** `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`

*   **[`DEXPool.sol`](contracts/DEXPool.sol)**: Contrato de piscina de liquidez que implementa el modelo AMM de producto constante ($x \times y = k$) para el intercambio de tokens y la emisión de tokens LP.
    *   *Nota: No se despliega individualmente mediante Ignition, sino que es instanciado dinámicamente por `DEXFactory` al crear un par.*

*   **[`WETH.sol`](contracts/WETH.sol)**: Port del contrato WETH9 original adaptado a Solidity `0.8.35` para envolver Ether (ETH) en un token compatible con el estándar ERC-20.
    *   **Dirección en red local (localhost):** `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`

## 🎓 Herramientas Educativas (CLI)

*   **`commands/hashing-edu.js`**: Taller interactivo de consola para comprender los conceptos clave de funciones hash en Ethereum (Keccak-256 vs SHA-256, colisiones en hashing compactado y cálculo de selectores de función). Consulta su [README específico](commands/README.md) para más información.

## 🛠️ Configuración Técnica

*   **Versión de Solidity:** `0.8.35`
*   **Versión de EVM:** `cancun` (configurada en `hardhat.config.js` para aprovechar las últimas características y optimizaciones de la red Ethereum).
*   **Dependencias principales:** OpenZeppelin Contracts para estándares seguros y reutilizables.

## 🚀 Inicio Rápido

### Requisitos Previos
*   Node.js (versión 18 o superior recomendada)
*   npm o yarn

### Instalación
Instala las dependencias necesarias del proyecto:
```bash
npm install
```

### Comandos Principales

*   **Compilar contratos:**
    ```bash
    npx hardhat compile
    ```
*   **Ejecutar pruebas unitarias:**
    ```bash
    npx hardhat test
    ```
*   **Ejecutar pruebas con reporte de gas:**
    ```bash
    REPORT_GAS=true npx hardhat test
    ```
*   **Iniciar nodo local de desarrollo:**
    ```bash
    npx hardhat node
    ```
*   **Desplegar con Hardhat Ignition:**
    ```bash
    npx hardhat ignition deploy ./ignition/modules/<Modulo>.js --network <nombre_de_red>
    ```
*   **Ejecutar taller interactivo de hashing:**
    ```bash
    node commands/hashing-edu.js
    ```

## 📂 Estructura del Proyecto

*   `commands/`: Herramientas y scripts de consola interactivos de carácter educativo.
    *   `hashing-edu.js`: Taller de consola interactivo para aprender hashing con Ethers.js.
*   `contracts/`: Directorio de contratos inteligentes en Solidity.
    *   `BaseERC20.sol`: Contrato base de token ERC-20 implementado.
    *   `BaseERC1155.sol`: Contrato base de token ERC-1155 para insignias.
    *   `DEXFactory.sol`: Contrato de fábrica para instanciar piscinas de liquidez.
    *   `DEXPool.sol`: Contrato de piscina de liquidez para pares de tokens (AMM).
    *   `WETH.sol`: Contrato WETH para envolver Ether (ETH).
*   `test/`: Suite de pruebas unitarias escritas en JavaScript utilizando Ethers.js y Chai.
    *   `BaseERC20.js`: Pruebas de cobertura para el contrato BaseERC20.
    *   `BaseERC1155.js`: Pruebas de cobertura para el contrato BaseERC1155.
    *   `DEX.js`: Pruebas de cobertura para los contratos de DEXFactory y DEXPool.
    *   `WETH.js`: Pruebas de cobertura para el contrato WETH.
*   `ignition/modules/`: Módulos de despliegue con Hardhat Ignition (incluye `DEX.js` para la fábrica de DEX y `WETH.js` para WETH).
    *   `WETH.js`: Módulo de despliegue para el contrato WETH.
*   `hardhat.config.js`: Configuración centralizada de Hardhat (compilador, EVM Cancun, optimizaciones).

## 🤖 Guía para Agentes de IA

Si estás utilizando un agente de desarrollo basado en IA, por favor consulta el archivo [AGENTS.md](AGENTS.md) para conocer las reglas de contribución, incluyendo la regla mandatoria de mantener toda comunicación, código y documentación estrictamente en **español**.
