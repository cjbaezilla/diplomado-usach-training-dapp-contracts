# Contratos de la dApp de Entrenamiento - Diplomado USACH

Este repositorio contiene los contratos inteligentes (smart contracts) y el entorno de pruebas para la dApp de entrenamiento del Diplomado de la Universidad de Santiago de Chile (USACH). Está construido utilizando **Hardhat**.

## 🚀 Inicio Rápido

### Requisitos Previos
* Node.js (versión recomendada LTS)
* npm o yarn

### Instalación
Instala las dependencias necesarias:
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

## 📂 Estructura del Proyecto

*   `contracts/`: Contratos inteligentes escritos en Solidity (`.sol`).
*   `test/`: Suite de pruebas unitarias escritas en JavaScript/TypeScript.
*   `ignition/modules/`: Módulos de despliegue con Hardhat Ignition.
*   `hardhat.config.js`: Configuración de Solidity (`0.8.35`) y plugins de Hardhat.

## 🤖 Guía para Agentes de IA

Si estás utilizando un agente de desarrollo basado en IA, por favor consulta el archivo [AGENTS.md](AGENTS.md) para conocer las reglas de contribución, incluyendo la regla mandatoria de mantener toda comunicación y documentación en español.
