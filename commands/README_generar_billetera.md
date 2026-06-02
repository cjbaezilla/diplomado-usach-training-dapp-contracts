# 🔑 Generador de Billeteras Ethereum - Diplomado USACH

Este script utilitario permite generar una nueva dirección de Ethereum (billetera) de forma completamente aleatoria y segura (off-chain), mostrando su dirección pública, su llave privada (private key) y su frase mnemónica asociada.

---

## 🚀 Cómo Ejecutar la Herramienta

Asegúrate de estar en el directorio raíz del proyecto y tener las dependencias instaladas (`npm install`). Luego ejecuta el script con cualquiera de los siguientes comandos:

```bash
# Opción 1: Ejecución directa con Node.js
node commands/generar-billetera.js

# Opción 2: Otorgando permisos de ejecución y corriéndolo directamente
chmod +x commands/generar-billetera.js
./commands/generar-billetera.js
```

---

## 📚 Conceptos Importantes

### 1. Dirección Pública vs. Llave Privada
* **Dirección Pública (Public Address):** Es el identificador de tu cuenta en la red Ethereum. Es similar a tu número de cuenta bancaria o CBU; puedes compartirla libremente con otros para recibir fondos o tokens.
* **Llave Privada (Private Key):** Es el secreto matemático que demuestra la propiedad de la dirección pública. Con ella se firman las transacciones que transfieren activos. **Nunca debes compartirla**. Si alguien obtiene tu llave privada, tiene control total y definitivo de tus fondos.

### 2. Frase Mnemónica (Mnemonic Phrase / Seed Phrase)
* Es una representación legible por humanos (generalmente de 12 o 24 palabras en inglés) de la semilla criptográfica inicial a partir de la cual se derivan las llaves privadas y públicas de tu billetera (siguiendo el estándar BIP-39).
* Al igual que la llave privada, debe mantenerse bajo absoluta confidencialidad y respaldo seguro.

---

## ⚠️ Advertencia de Seguridad

> [!WARNING]
> Este script genera llaves criptográficas válidas en la red principal (Mainnet) y redes de prueba (Testnets) de Ethereum.
> **No utilices la dirección generada por este script en entornos productivos con fondos reales**, a menos que estés completamente seguro del aislamiento de tu entorno local.
