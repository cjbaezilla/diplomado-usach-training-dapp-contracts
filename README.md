# Contratos de la dApp de Entrenamiento - Diplomado USACH

Este repositorio contiene los contratos inteligentes (smart contracts) y el entorno de pruebas para la dApp de entrenamiento del Diplomado de la Universidad de Santiago de Chile (USACH). Está construido utilizando el framework de desarrollo **Hardhat**.

## 📄 Contratos del Proyecto

Actualmente, el proyecto cuenta con el siguiente contrato base:

*   **`BaseERC20.sol`**: Un token ERC-20 estándar y robusto que implementa características modernas de la biblioteca **OpenZeppelin Contracts** (`^5.6.1`), tales como:
    *   **Acuñación y Quema (`ERC20Burnable`, `mint`):** Permite emitir nuevos tokens (restringido al propietario) y destruir existentes.
    *   **Pausabilidad (`ERC20Pausable`):** Permite pausar todas las transferencias de tokens en caso de emergencia.
    *   **Control de Acceso (`Ownable`):** Gestión de propiedad para restringir funciones críticas al propietario.
    *   **Firmas sin Gas (`ERC20Permit`):** Soporte para aprobaciones mediante firmas (EIP-712), mejorando la experiencia del usuario.

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
*   `test/`: Suite de pruebas unitarias escritas en JavaScript utilizando Ethers.js y Chai.
    *   `BaseERC20.js`: Pruebas de cobertura para el contrato BaseERC20.
*   `ignition/modules/`: Módulos de despliegue con Hardhat Ignition.
*   `hardhat.config.js`: Configuración centralizada de Hardhat (compilador, EVM Cancun, optimizaciones).

## 🤖 Guía para Agentes de IA

Si estás utilizando un agente de desarrollo basado en IA, por favor consulta el archivo [AGENTS.md](AGENTS.md) para conocer las reglas de contribución, incluyendo la regla mandatoria de mantener toda comunicación, código y documentación estrictamente en **español**.
