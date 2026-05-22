# 🎓 Taller Interactivo de Hashing (CLI) - Diplomado USACH

Este directorio contiene una herramienta interactiva para la línea de comandos (CLI) diseñada para enseñar y experimentar con los conceptos fundamentales de las funciones hash criptográficas dentro del ecosistema de Ethereum y Web3, utilizando **Ethers.js (v6)**.

---

## 🚀 Cómo Ejecutar la Herramienta

Asegúrate de estar en el directorio raíz del proyecto y tener las dependencias instaladas (`npm install`). Luego ejecuta el script interactivo con cualquiera de los siguientes comandos:

```bash
# Opción 1: Ejecución directa (si diste permisos de ejecución)
./commands/hashing-edu.js

# Opción 2: Usando Node.js directamente
node commands/hashing-edu.js
```

---

## 📚 Conceptos Educativos Cubiertos

La herramienta interactiva te permite explorar cinco áreas críticas del hashing en Web3:

### 1. Keccak-256 (El Estándar de Ethereum)
* **¿Qué es?**: Keccak-256 es el algoritmo de hash criptográfico nativo en la Ethereum Virtual Machine (EVM). Es la base del direccionamiento, firmas, cifrado y generación de estados en Ethereum.
* **Keccak-256 vs SHA-3**: Durante las primeras fases del desarrollo de Ethereum, se adoptó Keccak-256. Posteriormente, el NIST estandarizó SHA-3 con ligeras modificaciones en los parámetros de relleno (padding). Por lo tanto, **el Keccak-256 usado en Ethereum no es exactamente igual al estándar oficial de la familia SHA-3 (FIPS 202)**.
* **Ethers.js**: Puedes calcularlo usando `ethers.keccak256(ethers.toUtf8Bytes("texto"))` o el atajo directo `ethers.id("texto")`.

### 2. SHA-256
* **¿Qué es?**: Un algoritmo de la familia SHA-2, muy popular en la criptografía tradicional y la base de la red Bitcoin (para minería y generación de direcciones).
* **SHA-256 en Ethereum**: La EVM ofrece soporte para SHA-256 a través de un contrato precompilado especial (ubicado en la dirección `0x02`). Sin embargo, llamar a este contrato requiere más gas que ejecutar el opcode de instrucción directa `keccak256` (`0x20`), por lo que generalmente se prefiere Keccak-256 para lógica interna de Solidity.

### 3. Solidity Packed Hashing y Colisiones
* **`abi.encodePacked`**: En Solidity, es común compactar variables antes de calcular un hash para ahorrar gas. Esto se hace concatenando los valores directamente en crudo, sin añadir relleno (padding) de bytes.
* **La Vulnerabilidad de Colisión**: Si tienes dos parámetros de tipo dinámico (`string` o `bytes`) consecutivos en `abi.encodePacked(a, b)`, se generará una colisión si los caracteres se desplazan entre variables.
  * **Ejemplo**:
    * `a = "AAA"`, `b = "BBB"` $\rightarrow$ compactado = `AAABBB`
    * `a = "AA"`, `b = "ABBB"` $\rightarrow$ compactado = `AAABBB`
    * En ambos casos, el hash resultante será exactamente idéntico. Si este hash se utiliza para firmar o autorizar acciones, un usuario malintencionado podría suplantar u omitir validaciones de firmas.
* **Cómo solucionarlo**:
  1. Utilizar `abi.encode(...)` en lugar de `abi.encodePacked(...)`. Esto añade relleno de hasta 32 bytes para cada variable, aislando los datos.
  2. Añadir un separador constante si se requiere compactación obligatoria (ej: `abi.encodePacked(a, "-", b)`).

### 4. Selectores de Funciones (Method ID)
* **¿Qué es?**: La EVM no almacena ni lee cadenas de texto con los nombres de las funciones cuando procesa una llamada. En su lugar, utiliza un identificador de 4 bytes (8 caracteres hexadecimales) llamado **Function Selector** o **Method ID**.
* **Cálculo**: Es el resultado de aplicar Keccak-256 a la **firma canónica** de la función (el nombre de la función y los tipos de datos de sus argumentos separados por comas, sin espacios ni nombres de variables) y extraer los primeros 4 bytes.
  * **Ejemplo**: `transfer(address,uint256)`
  * `keccak256("transfer(address,uint256)")` $\rightarrow$ `0xa9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b`
  * Los primeros 4 bytes son: `0xa9059cbb`. Este es el selector de la función.
* **Uso**: Cada vez que envías una transacción interactuando con un contrato, los primeros 4 bytes del campo `data` (calldata) le indican a la EVM a qué función dirigir la ejecución.

### 5. Propiedades de las Funciones Hash (Efecto Avalancha)
* **Avalancha**: Una de las propiedades más importantes de los hashes criptográficos es que una modificación mínima en el input (incluso un solo bit o cambiar una letra de mayúscula a minúscula) da como resultado un hash completamente diferente y sin correlación visual alguna con el original.
* **Determinismo**: La misma entrada siempre producirá exactamente la misma firma hash de salida de 32 bytes.

---

## 🛠️ Ejemplos Prácticos en Consola

Al ejecutar el script interactivo, la terminal te guiará paso a paso:
1. Podrás ingresar textos libres para observar la salida binaria e hexadecimal y su conversión a hashes Keccak-256 y SHA-256.
2. Podrás emular la vulnerabilidad de colisiones de `abi.encodePacked` ingresando tus propios valores.
3. Podrás descifrar el Method ID de cualquier firma de función Solidity que definas.
4. Experimentarás con el efecto avalancha ingresando textos similares.

---
*Este taller forma parte del material práctico de desarrollo de Smart Contracts del Diplomado USACH.*
