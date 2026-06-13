# ⚡ Envío de Tokens por Lote (CLI) - Diplomado USACH

Este script de consola automatizado permite realizar la transferencia por lotes (distribución masiva) de tokens ERC20 a un listado de direcciones configuradas directamente en el código de forma estática, haciendo uso del contrato inteligente `BatchTransfer` desplegado en Sepolia.

---

## ⚙️ Configuración de Parámetros

Antes de ejecutar la herramienta, abre el archivo [commands/enviar-lote.js](enviar-lote.js) y modifica la sección de configuración de parámetros que se encuentra en la parte superior:

```javascript
// ==================== CONFIGURACIÓN DE PARÁMETROS (MODIFICAR AQUÍ) ====================

// Dirección del token ERC20 que deseas enviar (ej: WETH Sepolia)
const TOKEN_ADDRESS = "0x3E7B9d0da44D0c4Edb60a2261f89007f05419317";

// Cantidad de tokens a enviar a cada destinatario (ej. "0.05")
const AMOUNT_PER_RECIPIENT = "0.05";

// Arreglo de direcciones destinatarias
const RECIPIENTS = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
];

// ======================================================================================
```

---

## 🚀 Cómo Ejecutar la Herramienta

Asegúrate de estar en el directorio raíz del proyecto, de tener las dependencias instaladas (`npm install`) y de contar con las variables de entorno `SEPOLIA_RPC_URL` y `PRIVATE_KEY` correctamente configuradas en tu archivo `.env`.

Luego, ejecuta el script con cualquiera de los siguientes comandos:

```bash
# Opción 1: Ejecución directa con Node.js
node commands/enviar-lote.js

# Opción 2: Ejecución directa del script ejecutable
./commands/enviar-lote.js
```

---

## 🛠️ Flujo de Funcionamiento del Script

1. **Lectura de Variables:** El script lee las variables de entorno para conectarse a la red Ethereum Sepolia mediante el proveedor RPC y derivar tu dirección de billetera.
2. **Carga de Parámetros:** Carga los parámetros estáticos configurados en el código (`TOKEN_ADDRESS`, `AMOUNT_PER_RECIPIENT` y el arreglo de `RECIPIENTS`).
3. **Validación Inicial:** Verifica que las direcciones sean válidas y consulta la información del token (nombre, símbolo y decimales) en la blockchain.
4. **Validación de Saldo:** Comprueba si tu balance es suficiente para cubrir el total a transferir.
5. **Transacción de Aprobación Automática (si es necesaria):**
   * Comprueba si el contrato `BatchTransfer` ya cuenta con aprobación para mover tus tokens.
   * Si la aprobación es menor que el monto total requerido, el script emite y espera la confirmación de una transacción de `approve` de manera completamente automatizada.
6. **Ejecución del Lote:** Envía la transacción final llamando a `batchTransfer` en el contrato `BatchTransfer` para realizar la distribución en cadena en una sola operación.

---

## ⚠️ Advertencia de Seguridad

> [!WARNING]
> Este script hace uso de la clave privada configurada en tu archivo `.env` para firmar y enviar transacciones reales en la red Ethereum Sepolia.
> Asegúrate de que tu archivo `.env` esté listado en tu `.gitignore` para no subir tus llaves privadas a ningún repositorio público.
