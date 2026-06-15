# Clase 4: Introducción Práctica a Solidity para Perfiles de Negocio

¡Te damos la bienvenida a la **Clase 4**! Este módulo está diseñado para entender cómo funciona Solidity y los contratos inteligentes sin necesidad de tener un trasfondo técnico avanzado de programación.

En lugar de enfocarnos en matemáticas complejas o algoritmos abstractos, abordaremos los conceptos fundamentales de la Web3 a través de **15 casos prácticos del mundo empresarial**. A lo largo de esta clase, verás cómo se digitalizan procesos corporativos típicos como el registro de activos, el pago de nóminas, el control de logística, la gobernanza y los acuerdos de fideicomiso.

---

## 🗺️ Mapa de Ruta del Aprendizaje (Dificultad Progresiva)

A continuación se presenta el itinerario académico de los 15 contratos de menor a mayor complejidad:

| Nivel | Contrato | Concepto Técnico | Aplicación / Analogía de Negocio |
| :---: | :--- | :--- | :--- |
| **1** | [01_AlmacenamientoSimple](./01_AlmacenamientoSimple.sol) | Variables de estado básicas (`string`). | Registrar el nombre de una empresa u organización en la blockchain. |
| **2** | [02_RegistroActivos](./02_RegistroActivos.sol) | Tipos de datos (`uint256`, `bool`, `address`) y Constructor. | Registrar un activo de la empresa (valor, ID y estado de depreciación) al desplegar. |
| **3** | [03_ControlAccesoBasico](./03_ControlAccesoBasico.sol) | Restricciones de acceso (`require`) y Modificadores. | Asegurar que únicamente el Gerente General pueda modificar la dirección física corporativa. |
| **4** | [04_RegistroProveedores](./04_RegistroProveedores.sol) | Estructuras de datos (`struct`). | Crear una ficha de proveedor que consolida múltiples datos bajo una misma entidad. |
| **5** | [05_DirectorioClientes](./05_DirectorioClientes.sol) | Diccionarios asociativos (`mapping`). | Consultar de forma instantánea el estado crediticio de un cliente usando su dirección Ethereum. |
| **6** | [06_ListaProveedoresCompletos](./06_ListaProveedoresCompletos.sol) | Mapeos estructurados (`mapping` a `struct`). | Gestionar un catálogo completo de proveedores corporativos indexados por su wallet. |
| **7** | [07_BuzonSugerencias](./07_BuzonSugerencias.sol) | Listas dinámicas (`arrays`) y bucles (`for`). | Crear un buzón interno donde los empleados depositan propuestas evaluables por auditoría. |
| **8** | [08_CajaChica](./08_CajaChica.sol) | Funciones de pago (`payable`) y balances. | Una tesorería o caja chica de oficina que recibe fondos y permite retiros autorizados. |
| **9** | [09_NominaMensual](./09_NominaMensual.sol) | Transferencias directas e Historial (`events`). | Pagar la nómina a un colaborador con registro automático e inmutable de la transacción. |
| **10** | [10_SeguimientoEnvios](./10_SeguimientoEnvios.sol) | Estados definibles (`enum`). | Monitorear en tiempo real el ciclo de despacho internacional (Creado, En Tránsito, Recibido, Cancelado). |
| **11** | [11_FideicomisoSimple](./11_FideicomisoSimple.sol) | Variables de tiempo (`block.timestamp`). | Contrato de garantía (Escrow) que libera un pago solo tras el cumplimiento de un plazo de entrega. |
| **12** | [12_RepartoDividendos](./12_RepartoDividendos.sol) | Distribución matemática de saldos. | Repartir de forma automática los ingresos recibidos entre socios según su porcentaje accionario. |
| **13** | [13_VotacionDirectorio](./13_VotacionDirectorio.sol) | Lógica de votación y prevención de doble voto. | Votación digital de la Junta Directiva para aprobar presupuestos corporativos. |
| **14** | [14_ContratoMultifirmaLigero](./14_ContratoMultifirmaLigero.sol) | Firmas conjuntas y estados de propuesta. | Exigir la firma de al menos dos directores de la empresa para poder transferir fondos. |
| **15** | [15_SuscripcionServicio](./15_SuscripcionServicio.sol) | Vencimiento de tiempos y cobros periódicos. | Gestionar un SaaS o membresía mensual, bloqueando el acceso al expirar el tiempo contratado. |

---

## 💡 Conceptos Clave para Entender el Código

Cuando leas los contratos inteligentes, te encontrarás con ciertos términos técnicos que tienen equivalencias muy sencillas en el mundo de los negocios:

1. **Variables de Estado (State Variables)**: Es la base de datos del contrato. La información que se guarda aquí queda escrita de forma permanente e inmutable en la red.
2. **Constructor**: Es el proceso de constitución. Código que se ejecuta una sola vez al momento de "nacer" o desplegar el contrato en la red. Sirve para configurar parámetros iniciales (ej. definir quién es el dueño del contrato o el capital inicial).
3. **Modificadores (Modifiers)**: Son las políticas y normativas de la empresa. Cláusulas de seguridad que se ejecutan antes de realizar una acción para validar si la persona tiene permisos adecuados.
4. **Events (Eventos)**: Son los libros contables o bitácoras. Generan un registro permanente fuera de la base de datos del contrato que permite a los sistemas externos (páginas web, ERPs) enterarse de que ocurrió un evento importante (ej. "Pago de nómina exitoso").
5. **Mapping**: Funciona como un índice de archivador. Colocas una clave (como el RUT de un proveedor o una wallet de Ethereum) y obtienes directamente su expediente sin tener que buscar hoja por hoja.

---

## 🛠️ Instrucciones de Uso

Para compilar todos los contratos inteligentes de esta clase en el entorno del proyecto:

1. Asegúrate de estar en el directorio raíz del proyecto.
2. Ejecuta el comando de compilación:
   ```bash
   npx hardhat compile
   ```
3. El compilador generará los artefactos necesarios en la carpeta `artifacts/`. Si realizas modificaciones en algún contrato, este comando validará que no contenga errores de sintaxis o lógica de Solidity.
