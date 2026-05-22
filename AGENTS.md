# Guía de Agentes de IA - Contratos de dApp de Entrenamiento USACH

Este repositorio contiene los contratos inteligentes y el entorno de desarrollo basados en Hardhat para la dApp de entrenamiento del Diplomado de la Universidad de Santiago de Chile (USACH).

## 🚨 REGLA DE ORO MANDATORIA

> [!IMPORTANT]
> **Toda comunicación, documentación, escritura de archivos, comentarios de código, logs y mensajes de commits en este repositorio DEBEN realizarse estrictamente en ESPAÑOL.**

---

## 📂 Estructura del Repositorio

*   `contracts/`: Contiene los contratos inteligentes en Solidity (`.sol`).
*   `test/`: Contiene las pruebas unitarias escritas en JavaScript/TypeScript utilizando Mocha, Chai y Ethers.js.
*   `ignition/modules/`: Módulos de despliegue mediante **Hardhat Ignition**.
*   `hardhat.config.js`: Archivo de configuración central de Hardhat.

---

## 🛠️ Configuración y Versión de Solidity

*   **Versión de Solidity**: Este proyecto está configurado para utilizar Solidity **`0.8.35`** (según consta en `hardhat.config.js`). Cualquier contrato nuevo debe usar esta versión o una compatible declarada en el pragma.
*   **Entorno**: Node.js y npm para la gestión de dependencias.
*   **Bibliotecas**: Las bibliotecas de **OpenZeppelin Contracts** (`@openzeppelin/contracts`) están instaladas en su versión `^5.6.1` y se debe priorizar su uso para implementar estándares de tokens (ERC20, ERC721, etc.), control de acceso y utilidades de seguridad comunes.

---

## 💻 Comandos Útiles para el Agente

### 1. Compilación
Para compilar los contratos inteligentes y generar los artefactos:
```bash
npx hardhat compile
```

### 2. Ejecución de Pruebas
Para correr las pruebas unitarias en el directorio `test/`:
```bash
npx hardhat test
```

Para ejecutar las pruebas con reporte de consumo de gas:
```bash
REPORT_GAS=true npx hardhat test
```

### 3. Nodo Local (Red de Desarrollo)
Para levantar una red local de Ethereum (Hardhat Network) para pruebas locales de la dApp:
```bash
npx hardhat node
```

### 4. Despliegue con Hardhat Ignition
Para desplegar un contrato usando un módulo de Ignition en una red local u otra red configurada:
```bash
npx hardhat ignition deploy ./ignition/modules/<Modulo>.js --network <nombre_de_red>
```

---

## 📋 Directrices para Contribuir (Workflow)

Al realizar tareas en este repositorio, sigue estas directrices para mantener la consistencia:

1.  **Creación de Contratos**:
    *   Guarda los contratos en `contracts/` utilizando la extensión `.sol`.
    *   Utiliza nombres descriptivos en CamelCase (ej. `MiToken.sol`).
    *   Prioriza el uso de los contratos estándar de **OpenZeppelin** (ej. `ERC20`, `Ownable`, `AccessControl`) en lugar de reimplementar lógica común.
    *   Incluye comentarios aclaratorios y documentación NatSpec en **español** para explicar la lógica de funciones complejas.

2.  **Pruebas Unitarias (Tests)**:
    *   Cada contrato nuevo debe venir acompañado de su respectivo archivo de pruebas en la carpeta `test/` (ej. `MiToken.js`).
    *   Asegura una cobertura de código adecuada antes de dar por completado un desarrollo.

3.  **Módulos de Despliegue (Ignition)**:
    *   Define scripts de despliegue ordenados y modulares en `ignition/modules/`.
    *   Usa el patrón recomendado por Hardhat Ignition para facilitar futuras actualizaciones y testing local.
