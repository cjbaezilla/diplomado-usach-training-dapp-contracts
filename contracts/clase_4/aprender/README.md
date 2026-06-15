# Guías de Aprendizaje Detalladas - Clase 4

Este directorio contiene guías de estudio teóricas y técnicas detalladas correspondientes a los contratos inteligentes de la Clase 4 del Diplomado USACH. Cada archivo de esta carpeta profundiza en la teoría detrás de la implementación de Solidity, la arquitectura de la Ethereum Virtual Machine (EVM), costes de gas, seguridad y casos de negocio prácticos.

## Índice de Contenidos

Aquí puedes acceder a la explicación detallada de cada contrato:

1. **[01_AlmacenamientoSimple.md](./01_AlmacenamientoSimple.md)**: Explica el funcionamiento de variables de estado de tipo texto (`string`), compilación, y el diseño de almacenamiento de la EVM.
2. **[02_RegistroActivos.md](./02_RegistroActivos.md)**: Introduce tipos de datos de valor (`uint256`, `bool`, `address`), el constructor del contrato inteligente y la simulación del bytecode.
3. **[03_ControlAccesoBasico.md](./03_ControlAccesoBasico.md)**: Aborda los fundamentos teóricos del control de accesos, restricciones de seguridad (`require`), modificadores y la dirección cero.
4. **[04_RegistroProveedores.md](./04_RegistroProveedores.md)**: Detalla los tipos de referencia como estructuras (`struct`), ubicaciones de memoria (`storage`, `memory`, `calldata`) y la codificación ABI.
5. **[05_DirectorioClientes.md](./05_DirectorioClientes.md)**: Enseña la estructura de datos asociativa (`mapping`), el cálculo del slot criptográfico con Keccak-256 y mappings iterables.
6. **[06_ListaProveedoresCompletos.md](./06_ListaProveedoresCompletos.md)**: Explora la combinación de mapeos y estructuras (`mapping` a `struct`), optimizaciones avanzadas de gas y llamadas de bajo nivel.
7. **[07_BuzonSugerencias.md](./07_BuzonSugerencias.md)**: Analiza el uso de arreglos dinámicos (`arrays`), bucles `for` y la prevención crítica de ataques DoS por límites de gas de bloque.
8. **[08_CajaChica.md](./08_CajaChica.md)**: Presenta la recepción de fondos de Ether nativo (`payable`, `receive`, `fallback`), métodos de envío (`transfer`, `send`, `call`) y vulnerabilidad de reentrada.
9. **[09_NominaMensual.md](./09_NominaMensual.md)**: Aborda la abstracción de eventos y logs en Solidity, tópicos indexados, filtros de Bloom y uso de marcas de tiempo (`block.timestamp`).
10. **[10_SeguimientoEnvios.md](./10_SeguimientoEnvios.md)**: Introduce tipos enumerados (`enum`) para modelar máquinas de estado aplicadas a cadenas de suministro globales.
11. **[11_FideicomisoSimple.md](./11_FideicomisoSimple.md)**: Explora contratos de custodia (Escrow) con restricciones temporales y distribución segura basada en el patrón pull-over-push.
12. **[12_RepartoDividendos.md](./12_RepartoDividendos.md)**: Explica la aritmética de punto fijo en la EVM, prevención de desbordamientos aritméticos (`unchecked`) y el reparto equitativo de capital.
13. **[13_VotacionDirectorio.md](./13_VotacionDirectorio.md)**: Analiza un sistema de gobernanza y votación digital para juntas directivas, mitigando el doble voto y estructurando propuestas.
14. **[14_ContratoMultifirmaLigero.md](./14_ContratoMultifirmaLigero.md)**: Detalla la arquitectura de billeteras multi-firma, custodia institucional, transacciones conjuntas y flujos de aprobación.
15. **[15_SuscripcionServicio.md](./15_SuscripcionServicio.md)**: Aborda el control de vencimientos mediante `block.timestamp`, variables constantes de tiempo en la EVM, la recepción payable y el retiro seguro de Ether con el método de bajo nivel `.call` para un SaaS.


## Estructura Detallada de Capítulos (Árbol de Contenidos)

A continuación, se presenta un árbol en formato ASCII con todos los archivos de esta carpeta y las correspondientes secciones teóricas (`##`) que abordan:

```text
aprender/
├── 01_AlmacenamientoSimple.md
│   ├── Capítulo 1: Contexto Histórico y Académico del Almacenamiento en Blockchains
│   ├── Capítulo 2: El Compilador de Solidity y el Proceso de Compilación
│   ├── Capítulo 3: Estructura del Contrato y Anatomía del Bytecode
│   ├── Capítulo 4: Clasificación de Tipos de Datos y el Tipo String en la EVM
│   ├── Capítulo 5: Arquitectura del Almacenamiento (EVM Storage Layout)
│   ├── Capítulo 6: Ubicaciones de Datos (Data Locations): Storage, Memory y Calldata
│   ├── Capítulo 7: Visibilidad de Funciones y Variables
│   ├── Capítulo 8: Modificadores de Mutabilidad del Estado: View y Pure
│   ├── Capítulo 9: Retorno de Datos y Codificación ABI (Application Binary Interface)
│   ├── Capítulo 11: Criptografía y Curvas Elípticas en Ethereum
│   ├── Capítulo 12: Estructura de Datos RLP (Recursive Length Prefix)
│   ├── Capítulo 13: El Estándar EIP-1559 y el Mercado de Gas
│   ├── Capítulo 14: Árboles de Merkle Patricia Modificados en Detalle
│   ├── Capítulo 15: Motores de Base de Datos en los Clientes de Ethereum
│   ├── Capítulo 16: El Rol de la Red P2P y el Protocolo de Consenso
│   ├── Capítulo 17: Arquitectura de Pila (Stack) de la EVM y Limitaciones
│   ├── Capítulo 18: Mecanismo de Seguridad unchecked y su Uso Correcto
│   ├── Capítulo 19: Tipos de Transacciones en Ethereum: Legacy y EIP-2718
│   ├── Capítulo 20: El Concepto de Gas y su Relación con la Computación
│   ├── Capítulo 21: Soluciones de Escalabilidad: Rollups y Canales de Estado
│   ├── Capítulo 22: El Futuro del Almacenamiento: Verkle Trees y State Expiry
│   ├── Anexo A: Diccionario Enciclopédico de Opcodes de la EVM
│   ├── Anexo B: Preguntas Frecuentes y Casos Prácticos de Optimización de Gas
│   └── Capítulo 10: Referencias y Documentación Oficial de Solidity
├── 02_RegistroActivos.md
│   ├── Capítulo 1: Tipos de Datos de Valor (Value Types) y Representación Numérica en la EVM
│   ├── Capítulo 2: Tipos de Datos Booleanos y Operaciones Lógicas en la EVM
│   ├── Capítulo 3: El Tipo de Datos Dirección (Address) y el Modelo de Identidad de Ethereum
│   ├── Capítulo 4: El Constructor y el Ciclo de Vida del Despliegue de Contratos
│   ├── Capítulo 5: Estructura del Almacenamiento Físico (Storage Layout) del Contrato RegistroActivos
│   ├── Capítulo 6: Mutabilidad del Estado, Ejecución de Funciones y Reembolsos de Gas
│   ├── Capítulo 7: Patrones de Diseño, Gobernanza y Vulnerabilidad en el Control de Acceso
│   ├── Capítulo 8: Manual Completo de la EVM y Opcodes del Contrato
│   ├── Capítulo 9: Simulación de Bytecode y Estados de la EVM Paso a Paso
│   ├── Capítulo 10: Comparativa de Layouts de Almacenamiento y Gas de CPU
│   ├── Capítulo 11: Refactorizaciones y Patrones de Control de Acceso Avanzados
│   ├── Capítulo 12: Middleware, Eventos e Integración de Clientes Web3/DApps
│   ├── Capítulo 13: Economía de Gas, Post-EIP-1559 y Diferencias L1 vs L2/Blobs
│   ├── Apéndice A: Glosario Académico y Técnico de Conceptos de Solidity y la EVM
│   ├── Apéndice B: Compiladores de Solidity y Arquitectura Interna del AST y Yul
│   ├── Apéndice C: El Protocolo de Consenso de Ethereum, la EVM y la Red Global
│   ├── Apéndice D: Guía Didáctica de Laboratorio de Pruebas Unitarias para RegistroActivos
│   ├── Apéndice E: Modelado y Simulación Completa de un Caso de Negocio Real
│   ├── Apéndice F: Historial Completo y Futuro de las Propuestas de Mejora de Ethereum (EIP) Afectando el Gas
│   └── Referencias Académicas de la Documentación Oficial de Solidity
├── 03_ControlAccesoBasico.md
│   ├── Capítulo 1: Fundamentos Teóricos del Control de Acceso y Modelos de Confianza en Sistemas Distribuidos
│   ├── Capítulo 2: Análisis Detallado del Contrato `03_ControlAccesoBasico.sol` y Casos de Uso Corporativos
│   ├── Capítulo 3: Tipos de Datos de Identidad: `address` y `address payable` bajo la Lupa
│   ├── Capítulo 4: Modificadores en Solidity: Semántica, Sintaxis y Compilación
│   ├── Capítulo 5: El Operador Guion Bajo `_;` y los Puntos de Retorno de la EVM
│   ├── Capítulo 6: El Impacto de los Modificadores en el Tamaño del Bytecode y Optimización de Gas
│   ├── Capítulo 7: Gestión de Excepciones: La Evolución de `require`, `revert` y `assert`
│   ├── Capítulo 8: Errores Personalizados (Custom Errors) y el Ahorro Computacional de Gas
│   ├── Capítulo 9: La Dirección Cero (`address(0)`): Anatomía de una Vulnerabilidad Clásica
│   ├── Capítulo 10: Inicialización del Estado y Permisos en la Fase de Construcción
│   ├── Capítulo 11: Transferencia de Privilegios: De la Propiedad Simple a `Ownable2Step`
│   ├── Capítulo 12: Patrones de Control de Acceso Basado en Roles (RBAC) y Seguridad en Sistemas Complejos
│   ├── Capítulo 13: Interacción con el Cliente: ABI, Firmas Digitales y Consolas Next.js
│   ├── Capítulo 14: Simulación Paso a Paso de Opcodes de Control de Acceso en la EVM
│   ├── Capítulo 15: Conclusiones Pedagógicas y Guía de Buenas Prácticas para Auditorías de Contratos
│   └── Bibliografía y Recursos de Profundización
├── 04_RegistroProveedores.md
│   ├── Capítulo 1: Introducción a los Tipos de Referencia y Estructuras en Solidity
│   ├── Capítulo 2: Disposición de Almacenamiento (Storage Layout) en la EVM para Estructuras
│   ├── Capítulo 3: Ubicaciones de Datos (Data Locations) en Solidity: Memory, Storage y Calldata
│   ├── Capítulo 4: Análisis Detallado del Contrato `RegistroProveedores.sol`
│   ├── Capítulo 5: El Identificador Fiscal RUT en Chile y la Gestión de Cadenas de Texto en la EVM
│   ├── Capítulo 6: Asignación y Gestión de Memoria a Bajo Nivel en la EVM
│   ├── Capítulo 7: Codificación y Decodificación ABI de Estructuras
│   ├── Capítulo 8: Control de Acceso y Roles de Administración de Compras
│   ├── Capítulo 9: Auditoría, Seguridad y Patrones de Vulnerabilidad Comunes
│   ├── Capítulo 10: Integración de la dApp con Clientes Web (Ethers.js y Viem)
│   ├── Capítulo 11: Técnicas Avanzadas de Optimización de Gas para Estructuras
│   ├── 1. Reordenamiento Estratégico de Campos para el Empaquetamiento Compacto
│   ├── 2. Uso de Tipos de Datos de Tamaño Fijo en Lugar de Tipos Dinámicos
│   ├── 3. Evitar Lecturas y Escrituras Redundantes en Storage
│   ├── Capítulo 12: Conclusiones Pedagógicas y Guía de Autoaprendizaje
│   └── Referencias Técnicas Oficiales
├── 05_DirectorioClientes.md
│   ├── Contrato Inteligente de Estudio: `05_DirectorioClientes.sol`
│   ├── Capítulo 1: Fundamentos de la Estructura de Datos Mapping en Solidity y su Equivalente Teórico
│   ├── Capítulo 2: Funcionamiento Interno de los Mappings en el Storage de la EVM
│   ├── Capítulo 3: Cálculo del Slot de Almacenamiento mediante Keccak-256 a Bajo Nivel
│   ├── Capítulo 4: Comparación Completa de Rendimiento y Gas: Mappings vs. Arreglos y Estructuras
│   ├── Capítulo 5: El Límite de Iterabilidad en Mappings y la Arquitectura de un Mapping Iterable
│   ├── Capítulo 6: Análisis Detallado del Contrato DirectorioClientes.sol
│   ├── Capítulo 7: Gestión de Riesgos Financieros y Modelos de Calificación Crediticia On-Chain
│   ├── Capítulo 8: Control de Acceso mediante el Rol de Analista de Riesgos en Solidity
│   ├── Capítulo 9: El Valor por Defecto (Default Value) en Mappings y su Impacto en la Seguridad
│   ├── Capítulo 10: Validación de Entradas de Datos: Prevención de la Dirección Cero y Límites de Calificación
│   ├── Capítulo 11: Modificadores de Estado view y pure en Consultas de Mappings
│   ├── Capítulo 12: Integración del Directorio de Clientes con Clientes Web y dApps (Ethers.js y Viem)
│   ├── Capítulo 13: Optimización Avanzada de Gas en Operaciones con Mappings
│   ├── Capítulo 14: Patrones de Almacenamiento Compuestos: Mappings de Estructuras y Mappings Aninados
│   ├── Capítulo 15: Conclusiones Pedagógicas, Guía de Autoaprendizaje y Buenas Prácticas de Auditoría
│   └── Referencias Académicas de la Documentación Oficial de Solidity
├── 06_ListaProveedoresCompletos.md
│   ├── Capítulo 1: Fundamentos Teóricos de Estructuras de Datos Compuestas en Solidity y Casos de Uso Corporativos
│   ├── Capítulo 2: Arquitectura del Storage de la EVM para Mappings de Structs y Cálculo de Slots
│   ├── Capítulo 3: Gestión de Strings Dinámicos en Estructuras y Representación Binaria a Bajo Nivel
│   ├── Capítulo 4: Desglose Línea por Línea del Contrato ListaProveedoresCompletos.sol
│   ├── Capítulo 5: Modificadores y Roles de Gobernanza: Gerente de Finanzas y Control de Acceso
│   ├── Capítulo 6: Análisis Detallado de Gas en Operaciones de Mappings y Structs
│   ├── Capítulo 7: Guía de Integración Cliente con Ethers.js v6 y Viem para Lectura y Escritura de Structs
│   ├── Capítulo 8: Opcodes Clave de la EVM en Operaciones de Colecciones y Mappings
│   ├── Capítulo 9: Simulación Paso a Paso de la EVM al Registrar un Proveedor
│   ├── Capítulo 10: Vulnerabilidades Comunes y Buenas Prácticas de Seguridad en Mappings Compuestos
│   ├── Capítulo 11: Comparativa General de Eficiencia de Datos en Solidity (Arrays vs. Mappings vs. Structs)
│   ├── Capítulo 12: Glosario Académico de Conceptos de Solidity de Nivel Avanzado
│   ├── Capítulo 13: La Evolución del Almacenamiento en Ethereum y el Impacto en Soluciones de Capa 2
│   └── Referencias Técnicas Oficiales
├── 07_BuzonSugerencias.md
│   ├── Capítulo 1: Fundamentos de Arrays y Estructuras de Datos Secuenciales en Solidity (Storage, Memory y Calldata)
│   ├── Capítulo 2: Arquitectura Física de Almacenamiento de la EVM para Listas Dinámicas y Algoritmos de Cálculo de Slots
│   ├── Capítulo 3: Mecánica de Modificación de Listas y Costes de Gas de Opcodes (`push`, `pop`, `delete` y `SSTORE`)
│   ├── Capítulo 4: Flujos de Control y Ejecución en el Bytecode de la EVM (Bucles, Saltos de Programa e Iteraciones)
│   ├── Capítulo 5: El Peligro Crítico del DoS por Límite de Gas de Bloque e Ingeniería de Mitigación en el Desarrollo Web3
│   ├── Capítulo 6: Análisis de Strings, Bytes Dinámicos y Codificación UTF-8 en Solidity
│   ├── Capítulo 7: Desglose Línea por Línea y Análisis Crítico de `07_BuzonSugerencias.sol`
│   └── Referencias Técnicas Oficiales
├── 08_CajaChica.md
│   ├── Capítulo 1: La Naturaleza Financiera de la EVM y la Gestión de Ether Nativo
│   ├── Capítulo 2: Funciones Receptoras Especiales (`receive` y `fallback`) y el Flujo de Entrada de Fondos
│   ├── Capítulo 3: Anatomía Comparativa de los Métodos de Envío de Ether: `transfer`, `send` y `call`
│   ├── Capítulo 4: Vulnerabilidad de Reentrada (Reentrancy) y el Patrón Checks-Effects-Interactions (CEI)
│   ├── Capítulo 5: Patrón de Retiro (Pull-over-Push) y Mitigación de DoS en Transferencias
│   ├── Capítulo 6: Opcodes Financieros de la EVM y la Instrucción de Autodestrucción (`SELFDESTRUCT`)
│   ├── Capítulo 7: Desglose Línea por Línea y Análisis Crítico de `08_CajaChica.sol`
│   └── Referencias Técnicas Oficiales
├── 09_NominaMensual.md
│   ├── Capítulo 1: La Abstracción de Eventos en Solidity y la Arquitectura de Logs de la EVM
│   ├── Capítulo 2: El Funcionamiento de los Tópicos y el Parámetro `indexed` en la Búsqueda Off-Chain
│   ├── Capítulo 3: La Criptografía de los Filtros de Bloom en la Estructura de Bloques de Ethereum
│   ├── Capítulo 4: Análisis Económico y Comparativo de Costes: Storage vs. Logs
│   ├── Capítulo 5: Mecanismos de Transferencia de Valor con `.call` y Seguridad contra Ataques Financieros
│   ├── Capítulo 6: La Dimensión Temporal de la EVM y la Seguridad en la Lectura de `block.timestamp`
│   ├── Capítulo 7: Desglose Línea por Línea y Análisis Crítico de `09_NominaMensual.sol`
│   └── Referencias Técnicas Oficiales de Solidity
├── 10_SeguimientoEnvios.md
│   ├── Capítulo 1: Máquinas de Estado en Solidity y el Paradigma del Control de Flujo Logístico
│   ├── Capítulo 2: Tipos Enumerados (Enums) en Solidity: Compilación y Representación en la EVM
│   ├── Capítulo 3: Organización de la Memoria y Almacenamiento (Storage vs Memory) en Estructuras de Datos Complejas
│   ├── Capítulo 4: Mapeos y Criptografía de Claves en el Almacenamiento Persistente
│   ├── Capítulo 5: Modificadores de Función y la Inyección de Bytecode
│   ├── Capítulo 6: Desglose Línea por Línea y Análisis Técnico de 10_SeguimientoEnvios.sol
│   ├── Capítulo 7: Verificación de Invariantes y Seguridad contra Ataques en Máquinas de Estado
│   └── Referencias Técnicas Oficiales de Solidity
├── 11_FideicomisoSimple.md
│   ├── Capítulo 2: La Dimensión Temporal en la EVM y el Uso de block.timestamp
│   ├── Capítulo 3: Transferencia de Ether y Mecánica de la Instrucción Call
│   ├── Capítulo 4: Patrones de Seguridad, Mitigación de Reentrancia y Pull over Push
│   ├── Capítulo 5: Desglose Técnico y Análisis Línea por Línea de FideicomisoSimple.sol
│   ├── Capítulo 6: Pruebas Unitarias Automatizadas e Integración Frontend con Viem y Ethers.js
│   └── Capítulo 7: Glosario Técnico de la EVM y Referencias de la Documentación Oficial
├── 12_RepartoDividendos.md
│   ├── Capítulo 1: Representación Fraccionaria y Aritmética de Punto Fijo en la EVM
│   ├── Capítulo 2: Orden Operacional y Mitigación del Residuo Aritmético
│   ├── Capítulo 3: Evolución de las Protecciones contra Desbordamiento y el Bloque Unchecked
│   ├── Capítulo 4: Opcodes Matemáticos y Gas Aritmético en la Máquina Virtual de Ethereum
│   ├── Capítulo 5: Vulnerabilidad de Denegación de Servicio (DoS) por Llamadas Secuenciales
│   ├── Capítulo 6: El Patrón de Retiro (Pull-over-Push) para la Distribución Segura de Dividendos
│   ├── Capítulo 7: Análisis Técnico de la Llamada de Bajo Nivel y Métodos de Transferencia
│   ├── Capítulo 8: Integración de la Función Receptora y Flujo Automatizado de Fondos
│   ├── Capítulo 9: Desglose Línea por Línea y Análisis Crítico de `12_RepartoDividendos.sol`
│   └── Referencias Técnicas Oficiales
├── 13_VotacionDirectorio.md
│   ├── Código del Contrato de Referencia (`13_VotacionDirectorio.sol`)
│   ├── Capítulo 1: Arquitectura Interna de la Máquina Virtual de Ethereum y Almacenamiento en Gobernanza
│   ├── Capítulo 2: El Layout de Almacenamiento y el Comportamiento de las Estructuras Contiguas en la EVM
│   ├── Capítulo 3: El Funcionamiento Matemático de los Mapeos y la Seguridad del Control de Acceso
│   ├── Capítulo 4: Mecánica de Modificadores, Flujo de Control y Validación de Roles en Solidity
│   ├── Capítulo 5: La Gestión del Tiempo en la EVM y la Seguridad de block.timestamp en Gobernanza
│   ├── Capítulo 6: El Ciclo de Vida de las Propuestas Corporativas, Resolución de Empates y Quórum de Seguridad
│   ├── Capítulo 7: Emisión de Eventos, Estructura de Logs y su Impacto en el Gas de la EVM
│   ├── Capítulo 8: Prevención de Ataques Lógicos, Consistencia Contable y la Mitigación del Doble Voto
│   ├── Capítulo 9: Riesgos de Centralización, Confianza Distribuida y la Figura del Secretario General
│   ├── Capítulo 10: Comparación con Patrones Avanzados de Gobernanza y el Estándar OpenZeppelin Governor
│   ├── Capítulo 11: Optimización de Gas, Compilación con solc y Opcodes Clave en Votación
│   ├── Capítulo 12: Firmas Criptográficas ECDSA, Gobernanza Híbrida y Delegación de Voto sin Gas
│   ├── Sección de Profundización Académica y Casos Prácticos en Solidity
│   └── Enlaces y Recursos de Profundización Académica
├── 14_ContratoMultifirmaLigero.md
│   ├── Código del Contrato de Referencia (`14_ContratoMultifirmaLigero.sol`)
│   ├── Capítulo 1: Arquitectura de carteras de firma múltiple y custodia empresarial de activos
│   ├── Capítulo 2: El layout de almacenamiento para mapeos anidados dentro de estructuras y arrays
│   ├── Capítulo 3: Evolución de las transferencias de Ether: la transición a call y desuso de transfer
│   ├── Capítulo 4: Control de accesos y validación de direcciones nulas en Solidity
│   ├── Capítulo 5: Patrones de seguridad en contratos de retiro y el principio Checks-Effects-Interactions
│   ├── Capítulo 6: Gestión del ciclo de vida de propuestas de transacciones y estados pendientes
│   ├── Capítulo 7: La función nativa receive, gas en llamadas pasivas de Ether y funciones fallback
│   ├── Capítulo 8: Criptografía y firmas multifirma: de firmas on-chain a esquemas MPC y firmas abstractas
│   ├── Capítulo 9: Análisis de gas en la ejecución de transacciones complejas de retiro
│   ├── Capítulo 10: Integración con estándares industriales de multifirma (Gnosis Safe) y gobernanza de custodia
│   ├── Capítulo 11: Gestión de memoria en Solidity: almacenamiento en memoria lineal de structs dinámicos
│   ├── Capítulo 12: Prevención de ataques lógicos y consistencia en el estado del saldo del contrato inteligente
│   ├── Sección de Profundización Académica y Casos Prácticos en Solidity
│   └── Enlaces y Recursos de Profundización Académica
└── 15_SuscripcionServicio.md
    ├── Capítulo 1: La Dimensión Temporal en la EVM (`block.timestamp` y Constantes de Tiempo)
    ├── Capítulo 2: Modelo de Negocio SaaS On-Chain y Recepción/Retiro de Fondos de Ether
    ├── Capítulo 3: Estructuras de Datos y Mappings en Storage para Control de Vencimientos
    ├── Capítulo 4: Modificadores de Acceso y Gestión de Propiedad
    ├── Capítulo 5: Desglose Línea por Línea y Análisis Crítico de `15_SuscripcionServicio.sol`
    └── Referencias Técnicas Oficiales
```
