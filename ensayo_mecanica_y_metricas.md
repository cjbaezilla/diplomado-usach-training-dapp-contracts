# Análisis de la Arquitectura de Contratos Inteligentes, Mecánica de Interacción de la dApp y Métricas On-chain del Diplomado USACH

![Introducción y Fundamentos Pedagógicos](docs/article_imgs/hero_page.png)

## Resumen Onchain

| Contrato / Componente | Dirección | Transacciones Totales (Etherscan / Est. Logs) | Eventos Registrados |
| :--- | :--- | :---: | :---: |
| **[StudentIdentity.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/StudentIdentity.sol)** | `0x652b7718F130329F3eC865f418FE2a2634fb5E29` | **33** (Etherscan) | **61** |
| **[TokenFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/TokenFactory.sol)** | `0x30A4CA7ad7947f7Df6fdAf0EC4D9f4540e0149bB` | **115** (Etherscan) | **115** |
| **[BaseERC1155.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BaseERC1155.sol)** | `0x6b727bC4560A05AEEB9c353396395B35c6Fdb57E` | **2** (Etherscan) | **245** |
| **[DEXFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/DEXFactory.sol)** | `0x2491e5C6d2aC321f0036fF5D561b7c72086Ba5a4` | **99** (Etherscan) | **98** |
| **[WETH.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/WETH.sol)** | `0x3E7B9d0da44D0c4Edb60a2261f89007f05419317` | **615** (Etherscan) | **960** |
| **[BatchTransfer.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BatchTransfer.sol)** | `0x3c9323F2BaDdDBB1B152feFA33FEC0b748239860` | **3** (Etherscan) | **2** |
| **DEX Pools (Agregado - 98 pools)** | *(Múltiples direcciones)* | **358** (Est. por logs) | **567** |
| **Tokens Personalizados (Agregado - 115 tokens)** | *(Múltiples direcciones)* | **1235** (Est. por logs) | **1283** |
| 📊 **TOTAL GENERAL ACUMULADO** | | 🚀 **2460** | 🏆 **3331** |

### Detalles Técnicos del Reporte de Consulta

*   **Red Blockchain:** `sepolia` (Chain ID: `11155111`)
*   **Bloque de Consulta de Datos:** `11115859`
*   **Fecha y Hora de Generación del Reporte:** `22-06-2026, 8:39:55 a. m.`
*   **Valor Total Bloqueado de la Plataforma (WETH TVL):** `33.3264 WETH`
*   **Cantidad de Pares de Intercambio con WETH:** `46 pares`

---

## Introducción y Fundamentos Pedagógicos

El aprendizaje del desarrollo de aplicaciones descentralizadas en el ecosistema Web3 requiere de plataformas interactivas que combinen la teoría y la práctica en entornos seguros, es por esta razón que diseñé para el Diplomado en Tecnologías Blockchain de la Universidad de Santiago de Chile, una infraestructura educativa robusta que permite a los estudiantes experimentar de forma directa con la descentralización, la inmutabilidad de los datos y la ejecución de lógica de negocio autoejecutable en redes compatibles con la Máquina Virtual de Ethereum, esta aproximación constructivista sitúa al alumno en el centro del proceso educativo al otorgarle la capacidad de desplegar sus propios activos financieros, interactuar con mercados automatizados y certificar sus competencias académicas mediante la obtención de reliquias no fungibles.

La plataforma educativa se articula sobre un sistema híbrido que conecta componentes distribuidos on-chain con servicios web tradicionales, la interfaz de usuario actúa como el portal de interacción donde los estudiantes conectan sus billeteras criptográficas y ejecutan transacciones, mientras que los contratos inteligentes implementados en la red de pruebas Sepolia aseguran la persistencia inmutable de la información y la ejecución rigurosa de las reglas del sistema, este ecosistema no solo sirve como una herramienta de entrenamiento práctico, sino que también genera un registro histórico completo de transacciones que puede ser analizado para evaluar el desempeño, el entendimiento técnico y la adopción de los conceptos clave de Web3 por parte de la comunidad estudiantil.

![Portada y Arquitectura Híbrida del Sistema Educativo dApp de la USACH](docs/article_imgs/portada.png)

### Recursos y Enlaces del Ecosistema

Para el desarrollo y seguimiento de las actividades de aprendizaje, se han dispuesto los siguientes recursos en línea:
*   **Laboratorio Web3 (dApp):** [web3-usach-lab.cbaeza.com](https://web3-usach-lab.cbaeza.com/)
*   **Repositorio de los Contratos Inteligentes:** [github.com/cjbaezilla/diplomado-usach-training-dapp-contracts](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts)
*   **Repositorio de la dApp:** [github.com/cjbaezilla/diplomado-usach-training-dapp](https://github.com/cjbaezilla/diplomado-usach-training-dapp)

---

## Análisis Técnico y Mecánica de los Contratos Inteligentes

### Registro de Identidad Académica ([StudentIdentity.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/StudentIdentity.sol))

La identidad digital soberana representa uno de los pilares del desarrollo Web3, en este sistema se implementa mediante el contrato inteligente de registro de identidades estudiantiles, este componente permite asociar una dirección de cuenta pública con un perfil estructurado de datos personales y académicos del alumno, la estructura de almacenamiento interna se define mediante una disposición eficiente en la memoria persistente del contrato, utilizando un mapeo que vincula direcciones Ethereum individuales con un registro que contiene el nombre completo, el correo electrónico institucional, el enlace al perfil profesional de LinkedIn, la cuenta de Twitter, el avatar en formato de enlace o hash del sistema de archivos interplanetario, el registro de fecha de actualización y una bandera de confirmación de registro.

![Registro de Identidad Académica](docs/article_imgs/struct_identity.png)

El acceso a este mapeo se realiza mediante una función externa que valida primeramente que el nombre provisto no sea una cadena de texto vacía, en caso de omisión del nombre el contrato revierte la transacción a través de un error personalizado que optimiza el consumo de gas en comparación con las cadenas de texto tradicionales de requerimiento, una vez aprobada la validación se verifica si el estudiante ya poseía un registro previo, si la dirección de la billetera interactúa por primera vez el sistema activa la bandera de registro, introduce la dirección en una lista dinámica global de estudiantes registrados y almacena la posición del elemento en un mapeo de índices, esto permite iterar sobre las identidades y consultar el total de registros mediante llamadas de lectura externa, emitiendo eventos específicos para que los indexadores y el frontend detecten las nuevas identidades o las modificaciones de los perfiles existentes.

![Set Profile](docs/article_imgs/set_profile.png)

---

### Fábrica de Activos ERC-20 ([TokenFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/TokenFactory.sol) y [BaseERC20.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BaseERC20.sol))

La simulación financiera y la creación de economías de tokens requiere de una infraestructura ágil para la emisión de activos digitales, el contrato de la fábrica de tokens proporciona este mecanismo al permitir a los estudiantes instanciar de forma automatizada contratos individuales basados en el estándar ERC-20, el proceso se gestiona mediante una función que toma los parámetros del nombre, el símbolo y el suministro inicial que el estudiante desea asignar a su token personalizado, el contrato realiza una llamada de creación utilizando la palabra clave que despliega dinámicamente un nuevo contrato inteligente del tipo especificado y asigna la propiedad de la nueva instancia a la dirección que originó la llamada de creación.

![Fábrica de Activos ERC-20](docs/article_imgs/erc20_factory.png)

El contrato secundario desplegado hereda de la implementación estándar de OpenZeppelin e introduce extensiones para permitir la acuñación adicional de unidades por parte del propietario del token, esta estructura garantiza que los estudiantes posean control absoluto sobre la política monetaria de sus activos individuales, permitiendo simular procesos de emisión, distribución secundaria hacia otros compañeros del curso y provisión de liquidez en los mercados secundarios, el contrato registra el bloque de creación y emite eventos de transferencia iniciales hacia la dirección del creador si el suministro inicial configurado es mayor a cero, estableciendo la base para los flujos comerciales subsiguientes en la plataforma de entrenamiento.

![Contrato de Activos ERC-20](docs/article_imgs/erc20_contract.png)

---

### Creador de Mercado Automatizado ([DEXFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/DEXFactory.sol) y [DEXPool.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/DEXPool.sol))

La liquidez descentralizada se estructura mediante una fábrica de mercados y un conjunto de contratos de piscinas individuales que implementan el algoritmo de creador de mercado de producto constante, el contrato de la fábrica del mercado de intercambio gestiona un mapa bidireccional que asocia dos direcciones de tokens con la dirección única del contrato de la piscina de liquidez correspondiente, el algoritmo de creación de piscinas impone un orden estricto de las direcciones de los tokens involucrados mediante una comparación alfanumérica, esto asegura que solo pueda existir una piscina única por cada par de tokens, previniendo la duplicación del mercado y canalizando la liquidez de forma eficiente en la plataforma.

![Fábrica de Mercados](docs/article_imgs/dexfactory_contract.png)

El contrato de la piscina individual hereda de la implementación de tokens estándar para emitir acciones de liquidez que representan la copropiedad del fondo depositado por los proveedores, el núcleo matemático del intercambio se define mediante la conservación de la multiplicación de las reservas de ambos activos, de tal modo que cualquier retiro de un token debe ser compensado por el depósito proporcional del otro token, considerando una comisión fija del tres por mil que se acumula en las reservas para incentivar el aporte de capital, la inyección de liquidez inicial calcula las acciones a emitir mediante la raíz cuadrada geométrica de los montos depositados, mientras que los aportes subsiguientes deben respetar de forma estricta la proporción de precios actual en el pool para evitar desbalances de arbitraje inmediato.

![Contrato de Piscina](docs/article_imgs/dexpool_contract.png)

![Inyección de Liquidez](docs/article_imgs/add_liquidity_function.png)

![Información del Pool](docs/article_imgs/dex_pool_info.png)

Para ejecutar un intercambio el usuario llama a la función de intercambio especificando la dirección del token de entrada y el monto a entregar, el contrato calcula la cantidad de salida utilizando las reservas internas actualizadas y deduce la comisión, transfiriendo los tokens de entrada desde la dirección del usuario mediante la aprobación previa y enviando los tokens de salida resultantes al destinatario, las reservas se actualizan al consultar los balances reales del contrato para evitar discrepancias por transferencias directas, protegiendo las funciones críticas contra ataques de reentrada a través del uso de modificadores de control de flujo.

![Intercambio](docs/article_imgs/swap_function.png)

![Diseño de Almacenamiento](docs/article_imgs/dex_storage_layout.png)

---

### Envoltura de Ether y Transferencias Masivas ([WETH.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/WETH.sol) y [BatchTransfer.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BatchTransfer.sol))

La paridad entre el Ether nativo y los tokens basados en el estándar ERC-20 se resuelve mediante un contrato de envoltura que permite transformar la criptomoneda nativa de la red en un activo compatible con los contratos de las piscinas de intercambio, la envoltura se ejecuta enviando Ether al contrato que mantiene un balance exacto de uno a uno y acuña tokens de Wrapped Ether en favor del depositante, para recuperar el Ether nativo el proceso se invierte llamando a la función de retiro que quema los tokens de envoltura del usuario y transfiere el monto equivalente de Ether nativo de regreso a la billetera, esto permite que los estudiantes utilicen el activo nativo de la red de pruebas dentro del DEX.

[PLACEHOLDER: Diagrama de flujo del depósito y envoltura de Ether (WETH) y su paridad uno a uno]

Por otro lado, la distribución masiva de activos y la simplificación de tareas administrativas académicas se gestionan mediante un contrato de transferencias por lotes, este componente optimiza el consumo de gas de la red al empaquetar múltiples transferencias de tokens en una sola transacción, permitiendo a los profesores o administradores distribuir tokens de pruebas a múltiples direcciones de estudiantes de manera simultánea, el contrato itera sobre los arreglos de direcciones y montos y realiza las llamadas de transferencia, reduciendo los costos de transacción fijos asociados con la inicialización de múltiples transacciones individuales en la blockchain.

[PLACEHOLDER: Diagrama del flujo de optimización de gas en transferencias masivas con BatchTransfer.sol]

---

### Verificación Criptográfica y Reclamo de Reliquias ([ChallengeMinter.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/ChallengeMinter.sol) y [BaseERC1155.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BaseERC1155.sol))

La certificación del progreso académico de los estudiantes se gestiona a través de un sistema de insignias en formato ERC-1155 que se acuñan de forma descentralizada mediante una verificación criptográfica de firmas digitales, el contrato validador de desafíos delega la comprobación del cumplimiento de los requisitos a un backend centralizado que posee una llave privada autorizada bajo un rol específico, cuando un estudiante completa un desafío el backend valida la información on-chain utilizando un cliente ligero y genera un hash de mensaje con la dirección de la billetera del estudiante, el identificador numérico del desafío, un valor único de un solo uso para prevenir ataques de repetición y la dirección del propio contrato para evitar la reutilización de firmas en contratos paralelos.

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(msg.sender, id, salt, address(this))
);
bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
address signer = ethSignedMessageHash.recover(signature);
require(hasRole(SIGNER_ROLE, signer), "Firma invalida o no autorizada");
```

Una vez que el usuario recibe la firma y el valor de sal del servidor interactúa con la función de reclamo en el contrato del validador de desafíos, el contrato reconstruye el hash del mensaje utilizando las variables locales de la transacción y la dirección del remitente, aplica el prefijo estándar de mensajes firmados de Ethereum y recupera la dirección pública del firmante mediante la operación de recuperación de clave de curva elíptica, si la dirección recuperada posee el rol de firmante autorizado y el hash del mensaje no ha sido consumido previamente se marca la firma como utilizada en el mapeo de control de repetición y se ordena al contrato de insignias la acuñación inmutable del NFT correspondiente.

[PLACEHOLDER: Diagrama de secuencia del proceso de firma ECDSA y verificación en ChallengeMinter.sol]

[PLACEHOLDER: Diagrama de la estructura de permisos y AccessControl de ChallengeMinter.sol]

---

## Implementación de la Interfaz de Usuario y Procesos en la dApp

El portal web de entrenamiento se construye sobre un framework de desarrollo moderno enfocado en componentes reactivos y renderizado del lado del servidor, la integración con la blockchain de pruebas se realiza de forma segura mediante ganchos que manejan la conexión de billeteras Web3 y la sincronización del estado, la barra de navegación superior incorpora un botón interactivo que permite al estudiante conectar su billetera y cambiar de red, mostrando información sobre la red actual y el balance de Ether de la cuenta activa.

### Proceso de Registro de Estudiantes

El flujo de registro de la identidad estudiantil comienza cuando el alumno ingresa al panel de identidad en la dApp, la interfaz interactúa con el contrato de identidad de los estudiantes mediante hooks personalizados que leen el estado on-chain de la dirección conectada, si el usuario no posee un registro previo el frontend muestra un formulario detallado donde se solicita ingresar el nombre completo, el correo institucional con el dominio correspondiente y los enlaces de perfiles sociales, al hacer clic en enviar la dApp solicita la aprobación de la transacción mediante la extensión de la billetera, una vez confirmada la transacción los componentes reactivos detectan el evento de registro y actualizan la interfaz mostrando la tarjeta de perfil académico inmutable del estudiante.

[PLACEHOLDER: Captura de pantalla de la interfaz de registro de perfil estudiantil en la dApp con los campos del formulario]

---

### Proceso de Creación e Interacción con Tokens ERC-20

El simulador y portal de tokens personalizados ofrece una interfaz para el despliegue automático de nuevos activos, el estudiante introduce el nombre, el símbolo y el suministro en el panel de creación y confirma la operación firmando la transacción, el contrato de la fábrica despliega el token y emite el evento de creación, el cual es detectado por la interfaz para listar el nuevo activo en la tabla de tokens creados, desde este panel el propietario del token puede acuñar nuevas unidades o realizar transferencias directas a otros compañeros ingresando sus direcciones públicas y el monto, la interfaz oculta automáticamente los activos que no poseen balances positivos para mantener limpia la vista del usuario y muestra un historial de transferencias en tiempo real para auditar las transacciones on-chain.

[PLACEHOLDER: Interfaz de creación de tokens ERC-20 personalizados y panel de gestión de balances]

---

### Proceso de Operaciones y Provisión de Liquidez en el DEX

El mercado descentralizado integrado en la dApp permite a los estudiantes comprender de forma práctica el funcionamiento de las finanzas descentralizadas, el flujo comienza con la envoltura de Ether nativo a través de una pestaña dedicada donde el usuario deposita Ether y recibe el token Wrapped Ether necesario para comerciar, en el panel del mercado de intercambio el estudiante selecciona el par de tokens que desea intercambiar y visualiza las reservas de la piscina de liquidez junto con la tasa de conversión dinámica calculada en base al modelo de producto constante sin alterar la proporción geométrica, si la piscina no existe la interfaz permite desplegarla a través de la fábrica del mercado de intercambio.

[PLACEHOLDER: Vista de la pestaña de intercambio de tokens y la calculadora de precios del AMM en el DEX]

Para proveer liquidez el estudiante accede a la sección de aportes e ingresa la cantidad deseada del token base, la dApp calcula automáticamente la cantidad simétrica requerida del segundo token según la relación de precios de las reservas del pool, requiere que el usuario apruebe el uso de ambos tokens mediante transacciones previas y posteriormente envía la transacción de depósito que acuña los tokens LP de participación en el pool, el panel muestra la participación porcentual del estudiante sobre las reservas totales de la piscina y permite retirar la liquidez en cualquier momento devolviendo los tokens base y quemando los activos de participación.

[PLACEHOLDER: Interfaz de aprovisionamiento de liquidez simétrica y visualización de balances de tokens LP]

---

### Proceso de Validación y Reclamo de Reliquias Académicas

La senda de desafíos académicos consta de diez etapas que evalúan la interacción real de los estudiantes con los contratos inteligentes, cuando el estudiante completa una tarea en la blockchain presiona el botón de reclamo de la reliquia correspondiente en la interfaz, el frontend envía una solicitud HTTP al backend local que audita las transacciones del estudiante en la red utilizando un indexador de eventos, si el backend valida el cumplimiento de las condiciones firma los datos con la llave privada del servidor y responde con la firma criptográfica resultante.

La dApp recibe la firma y abre un modal interactivo donde el usuario confirma la llamada al contrato inteligente del mintero de desafíos, al procesar la transacción en la red el contrato inteligente verifica la firma contra la clave pública del backend y ordena la acuñación de la reliquia no fungible, al confirmarse la transacción la dApp despliega una animación festiva y actualiza la galería de reliquias del estudiante mostrando el logro en formato de tarjeta digital inmutable con sus respectivos metadatos.

[PLACEHOLDER: Interfaz de la senda de desafíos académicos y modal de confirmación de reclamo de la reliquia NFT]

---

## Reporte Completo de Uso de la Plataforma y Métricas On-chain

A continuación, se detalla el reporte completo extraído del historial de la cadena de bloques Sepolia el cual documenta la actividad acumulada por los estudiantes en la plataforma de entrenamiento del Diplomado de la Universidad de Santiago de Chile.

### Resumen General de Actividad

La actividad general de la plataforma se consolida en la siguiente tabla que detalla el número de transacciones totales reportadas por los indexadores y la cantidad de eventos emitidos por los contratos inteligentes principales.

| Contrato / Componente | Dirección | Transacciones Totales (Etherscan / Est. Logs) | Eventos Registrados |
| :--- | :--- | :---: | :---: |
| **[StudentIdentity.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/StudentIdentity.sol)** | `0x652b7718F130329F3eC865f418FE2a2634fb5E29` | **33** (Etherscan) | **61** |
| **[TokenFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/TokenFactory.sol)** | `0x30A4CA7ad7947f7Df6fdAf0EC4D9f4540e0149bB` | **115** (Etherscan) | **115** |
| **[BaseERC1155.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BaseERC1155.sol)** | `0x6b727bC4560A05AEEB9c353396395B35c6Fdb57E` | **2** (Etherscan) | **245** |
| **[DEXFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/DEXFactory.sol)** | `0x2491e5C6d2aC321f0036fF5D561b7c72086Ba5a4` | **99** (Etherscan) | **98** |
| **[WETH.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/WETH.sol)** | `0x3E7B9d0da44D0c4Edb60a2261f89007f05419317` | **615** (Etherscan) | **960** |
| **[BatchTransfer.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BatchTransfer.sol)** | `0x3c9323F2BaDdDBB1B152feFA33FEC0b748239860` | **3** (Etherscan) | **2** |
| **DEX Pools (Agregado - 98 pools)** | *(Múltiples direcciones)* | **358** (Est. por logs) | **567** |
| **Tokens Personalizados (Agregado - 115 tokens)** | *(Múltiples direcciones)* | **1235** (Est. por logs) | **1283** |
| 📊 **TOTAL GENERAL ACUMULADO** | | 🚀 **2460** | 🏆 **3331** |

---

### Detalles Técnicos del Reporte de Consulta

*   **Red Blockchain:** `sepolia` (Chain ID: `11155111`)
*   **Bloque de Consulta de Datos:** `11115859`
*   **Fecha y Hora de Generación del Reporte:** `22-06-2026, 8:39:55 a. m.`
*   **Valor Total Bloqueado de la Plataforma (WETH TVL):** `33.3264 WETH`
*   **Cantidad de Pares de Intercambio con WETH:** `46 pares`

---

### Identidad Estudiantil ([StudentIdentity.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/StudentIdentity.sol))

La participación de los estudiantes en el contrato de registro de identidades refleja las siguientes métricas clave de adopción académica:

*   **Estudiantes Únicos Registrados:** `27`
*   **Actualizaciones de Perfil Realizadas:** `34`
*   **Usuarios Únicos Interactuando:** `25`

El detalle exhaustivo de los estudiantes registrados en la red se detalla en la siguiente tabla de registros on-chain.

| Estudiante (Dirección) | Nombre | Email | Bloque | Tx Hash |
| :--- | :--- | :--- | :---: | :--- |
| `0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772` | **Profe Carlos** | `hola@cbaeza.com` | 10970169 | [`ver tx`](https://sepolia.etherscan.io/tx/0x9982d43cde598a7e4ca7f4de3edac78b6aa19ce03e9e9c7f23bd7987b5f980b4) |
| `0x5953D009299f31fac1d7B08176Cc7a7A571405Cb` | **Escudero Maestro** | `escudero@unmailfalso.net` | 10976222 | [`ver tx`](https://sepolia.etherscan.io/tx/0x6c1c746ecafa18d4c859225373a38dc3b7c6d4c1aee5cd114ba9c268f187f69e) |
| `0x5122aECe833b38e26b63756ACC1555C99afA1162` | **Danilo Contreras** | `dcontrerasl@live.com` | 10984620 | [`ver tx`](https://sepolia.etherscan.io/tx/0x3b4dc5a084b673138800847f544faf694adeb91cf6ca7f2b8f51680ecba46e80) |
| `0x760f11004aa59d898913E5aE768C648004f3bf47` | **Vinicio** | `marcos.reyes.m@gmail.com` | 10984627 | [`ver tx`](https://sepolia.etherscan.io/tx/0xbe0f3d43f2f02d6683ee2e5fe24fae74c363d04f1a6aa7991940599c6ad966e5) |
| `0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0` | **Alejandro Hernan Aguilera Bucarey** | `jano2312.aa@gmail.com` | 10985595 | [`ver tx`](https://sepolia.etherscan.io/tx/0xd527808f0475484cba68d386aa1314ce4aa240f2fb178b6020642858ac098c6b) |
| `0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B` | **Marcelo Pino Chandia** | `mpino03@gmail.com` | 10996511 | [`ver tx`](https://sepolia.etherscan.io/tx/0xfac639a35117fb5841d51dbedc26eef525bd6f141e024ef1cf96df2aae6a8f36) |
| `0x5bac18695637fbD41D5d64dCb93dc54D66FEEbf3` | **Cristian Manriquez Romero** | `cristianoo.manriquezr@gmail.com` | 11004053 | [`ver tx`](https://sepolia.etherscan.io/tx/0xaa5d23f711e761a4587448e7ca6ba95eea3beb74ff33e820f491a3c6d3c2d9f0) |
| `0x42ddE3F6ae39066b79767261AFD4Cb2c3d82eA96` | **Giovanna Fuentes Cabello** | `govifu@yahoo.es` | 11011443 | [`ver tx`](https://sepolia.etherscan.io/tx/0xbc6167d4dabcee356e06aad16befaf121c664db0828397c40dfc021ec089a9d1) |
| `0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68` | **Francisco Fuentes Infante** | `francisco.fuentes.i@usach.cl` | 11018724 | [`ver tx`](https://sepolia.etherscan.io/tx/0x712652355824ec31d0e0b38709fe7d1845c77dca0fc3179e60f79a2e5d74b29c) |
| `0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f` | **Omer Salazar** | `omersalazar@gmail.com` | 11019258 | [`ver tx`](https://sepolia.etherscan.io/tx/0xcb637cf198caa5cee120a27a5f35e633b904d3456b1de6d77646d5500a399522) |
| `0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C` | **Cristina Jalilie** | `cjalilie24@gmail.com` | 11030068 | [`ver tx`](https://sepolia.etherscan.io/tx/0x0c9f64f015478aeb2b5a79d21a27822f9aab37e5d25678f71ff891264a340d1b) |
| `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | **Sebastián Emilio Martí Cabrera** | `sebastianmarti99@gmail.com` | 11031359 | [`ver tx`](https://sepolia.etherscan.io/tx/0x464464a512ea69c8882b87dab3ad50969e205bf438c52ea5fe5f3483edb061a4) |
| `0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE` | **Romina Carrillo** | `romifrancarrinilo@gmail.com` | 11033682 | [`ver tx`](https://sepolia.etherscan.io/tx/0x099a03ea4688354b85bec6825bc94ae85ecb0ab0f9b966815b701fd1afa99a52) |
| `0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5` | **Juan Carlos Galdamez** | `jcarlosgaldamez@gmail.com` | 11034024 | [`ver tx`](https://sepolia.etherscan.io/tx/0x022d8b90a4445d6b4a3d03f2d69b51317d8f58be24e47105978533e2f43d4c56) |
| `0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42` | **Nico Villén** | `nicovillenagunsa@gmail.com` | 11034222 | [`ver tx`](https://sepolia.etherscan.io/tx/0x7eb1da726274cfe0736304261a058af8caa20f7c4aef62d9e4d74ec3c758bf62) |
| `0xA78B57234A481d69393381Ac1642DBCadd9B66F1` | **Miguel Contreras T.** | `miguel.contreras@usach.cl` | 11037907 | [`ver tx`](https://sepolia.etherscan.io/tx/0xe420f9dbeee1acde5e3a14d682e30ca011266dca46372a43ee1bfba5cf8465e3) |
| `0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF` | **Gabriel Nemunao** | `gabrielnemunaomolina05@gmail.com` | 11041120 | [`ver tx`](https://sepolia.etherscan.io/tx/0xbe5652773a89087d52c1925a032cba9c70bd3d8c71a90e9d2d8f3748f46463c7) |
| `0x82528840954594A11855a1fDA9b19AEda6BCEa4F` | **Nicolas Alberto Donoso Lopez** | `ni.donoso@gmail.com` | 11047013 | [`ver tx`](https://sepolia.etherscan.io/tx/0x8727134b0749ba0ad3f2b4c6ce56463a6892e520d4ed09e25931a0a27c32f92c) |
| `0xf133e655555711E25CD9723a8e83A7C53a5D91a4` | **Victor Morales** | `victor.morales@usach.cl` | 11047114 | [`ver tx`](https://sepolia.etherscan.io/tx/0x254005b1449fb19408b401f17c0ac76d3badbaccc9f7c19329a9628ae23a6863) |
| `0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3` | **Ivonne Poletto** | `boxmerced@gmail.com` | 11047300 | [`ver tx`](https://sepolia.etherscan.io/tx/0x5871d1eaae895ffe01aa818a3b9d5f191d1677c0a8d47a462c12a1403f053506) |
| `0x0e51080164B5Eb3F028D6A85deF9273457093c70` | **Manuel González Barra** | `gonzalezbarramanuel@gmail.com` | 11050076 | [`ver tx`](https://sepolia.etherscan.io/tx/0xfc49d6007cb9db5a87f372a9b7f2efa571746d8203a7b0b35d882bc6ef5a5532) |
| `0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121` | **Diego Alid Riveros** | `diegoalid@gmail.com` | 11053801 | [`ver tx`](https://sepolia.etherscan.io/tx/0xe13bd67347828b717f8fb4a0d75f611444c6f40358cb3983160d5473de5ab128) |
| `0x131B7E72CdD02717F74E1529ae4Ecb7C2dD39a4A` | **Daniel** | `daniel@identidad.cl` | 11060901 | [`ver tx`](https://sepolia.etherscan.io/tx/0x181fdaf0afa6d631d99f37c2a8b195a61fb3a20ca1a4afbe7e1ea27164905a5b) |
| `0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce` | **Juan Leon** | `leonar.c.juan@gmail.com` | 11061261 | [`ver tx`](https://sepolia.etherscan.io/tx/0xc916c3e0b840c0cafd26c99365fea541bbab0e219235d57fc80689090d8d5782) |
| `0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df` | **Javiera Rojas Vergara** | *(No registrado)* | 11068318 | [`ver tx`](https://sepolia.etherscan.io/tx/0x6eef30149d1576f19d564ff29e4501eacbeef44483b663672c7dd53613d85c6b) |
| `0x684858C2072Ef9eE7269B81d348a627956c44382` | **Javier Ferreira** | `zionghost7730@gmail.com` | 11069945 | [`ver tx`](https://sepolia.etherscan.io/tx/0xbbdb1bbbe99d4edc23a94db3f618d7ad221469031bec42fd463443770f2b2c6d) |
| `0x0BCDd9fB7647f285A16BC6DA358775b816d1DD3B` | **Felipe nuñez** | `felipenunezplaza@gmail.com` | 11086978 | [`ver tx`](https://sepolia.etherscan.io/tx/0x567906d97a73e63606146f8d6951522b8a80e2bf7fe975aa218abdd5c5a897e4) |

---

### Insignias y Desafíos Académicos ([BaseERC1155.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BaseERC1155.sol) y [ChallengeMinter.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/ChallengeMinter.sol))

El progreso y los logros académicos acreditados mediante insignias NFT muestran los siguientes resultados en la red:

*   **Desafíos Reclamados Exitosamente (vía ChallengeMinter):** `0`
*   **Total de Acuñaciones de Insignias (vía BaseERC1155):** `241`

La distribución detallada de insignias académicas acumuladas por cada una de las reliquias históricas del campus se especifica a continuación:

| ID Insignia | Nombre de la Reliquia | Cantidad Acuñada |
| :---: | :--- | :---: |
| `0` | Insignia #0: El Alambique y Recipiente (Taller de la EAO) | **27** |
| `1` | Insignia #1: La Turbina del Patio de Talleres (Legado Industrial) | **27** |
| `2` | Insignia #2: El Tablero de Control (Central Eléctrica EAO) | **27** |
| `3` | Insignia #3: La Sala de Exhibición (Maestría Industrial de la EAO) | **25** |
| `4` | Insignia #4: La Fragua y el Yunque (Taller de Forja de la EAO) | **24** |
| `5` | Insignia #5: La Caldera Babcock & Wilcox (Corazón de Vapor de la EAO) | **22** |
| `6` | Insignia #6: La Bodega del Laboratorio de Química (El Templo de la Alquimia) | **23** |
| `7` | Insignia #7: La Máquina de Vapor Cavé à Paris (El Motor Fundacional) | **23** |
| `8` | Insignia #8: La Urna Funeraria del General Las Heras (Maestría en Broncería) | **24** |
| `9` | Insignia #9: Los Taladros Mecánicos en Serie (Taller de Mecánica y Ajuste) | **19** |

---

### Liquidez e Intercambios del DEX ([DEXFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/DEXFactory.sol) y [DEXPool.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/DEXPool.sol))

La tabla consolidada del creador de mercado descentralizado registra un total de noventa y ocho piscinas de liquidez creadas, detallando las reservas de tokens depositadas, las acciones LP emitidas y la cantidad de operaciones ejecutadas por cada par.

| Piscina (Pool Address) | Par de Tokens | Reserva Token0 | Reserva Token1 | LP Emitido | Swaps | Aportes (+) | Retiros (-) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `0xbef9a0E94968Db74E4539a319955f2188cbeedd2` | **WETH / PESO** | 3.0346 **WETH** | 23026769.1615 **PESO** | `8349.634376` | **15** | **21** | **2** |
| `0x110B01dC90968091DD3b97f36f7a381dA1b12275` | **UTP / WETH** | 0 **UTP** | 0 **WETH** | `0` | **0** | **0** | **0** |
| `0xC5E85eA6C8C4D89695d978563b773a2DC59D45c2` | **WETH / MACONDO** | 1.4124 **WETH** | 32041.0851 **MACONDO** | `212.40145` | **11** | **11** | **1** |
| `0x7Dffcf389F9DD9e74Bae656580D8FABc4055E6F4` | **MPCH / TKGIO** | 10 **MPCH** | 10 **TKGIO** | `10` | **0** | **1** | **0** |
| `0xe4971777B481EDc4Dc3367A5C665076041A62bcc` | **TKGIO / MACONDO** | 0 **TKGIO** | 0 **MACONDO** | `0` | **0** | **0** | **0** |
| `0xC4d6F9bDb47416883D587301556c038448fc1BdA` | **WETH / TKGIO** | 0.2681 **WETH** | 985.2206 **TKGIO** | `16.205216` | **15** | **14** | **0** |
| `0x80865F5e57C0f520B90d577D85959f26591414D4` | **WETH / MPCH** | 2.5989 **WETH** | 3112.4194 **MPCH** | `89.880926` | **9** | **6** | **1** |
| `0xB856f1B6074A83C86437DE58c421237b5ba030e4` | **MPCH / MACONDO** | 0 **MPCH** | 0 **MACONDO** | `0` | **0** | **0** | **0** |
| `0xeE1E2f35c55184024B6F27E60AD243be2C823f3F` | **UTP / MPCH** | 0 **UTP** | 0 **MPCH** | `0` | **0** | **0** | **0** |
| `0xE60D72A4101dfCb5419842B456904eC16419BF37` | **MPCH / PESO** | 0 **MPCH** | 0 **PESO** | `0` | **0** | **0** | **0** |
| `0x08FeE1d134aa6f526f3469072eC7A85877bAd360` | **WETH / UTT** | 0.2113 **WETH** | 0.0000 **UTT** | `0.001383` | **4** | **1** | **0** |
| `0x4f8bb066005038D28A8EF09Cda9fB2e942c6D7d4` | **WETH / TM** | 2.4784 **WETH** | 366.0162 **TM** | `30.101727` | **15** | **12** | **1** |
| `0x2005166EAcA7C268E348642A8ee0c1760D3c2eCf` | **WETH / VTK** | 0 **WETH** | 0 **VTK** | `0` | **0** | **0** | **0** |
| `0x0Ad7772681Ec55695bba0F3b8fcE3CEeF6181679` | **FIRE / WETH** | 13532797055.1330 **FIRE** | 7.8464 **WETH** | `325410.278056` | **9** | **21** | **2** |
| `0x4c30c588a578D333aA30B53e5F4e76fAE7268000` | **ITA / TKGIO** | 0 **ITA** | 0 **TKGIO** | `0` | **0** | **0** | **0** |
| `0x6BC1947B3b9F62A18Eb49C1bd3AF09BEA60351F4` | **WETH / ITA** | 0.0507 **WETH** | 0.4009 **ITA** | `0.142116` | **8** | **4** | **0** |
| `0x92073b07AE5AEFbf11FE0Cb886bF8174776D8F63` | **TOKENCIT / WETH** | 48783.9628 **TOKENCIT** | 0.5390 **WETH** | `162.140059` | **7** | **5** | **1** |
| `0xfc22BCF856AAE09a9C9241a84AbCc093ebFBF6F9` | **WETH / MGT** | 0.2056 **WETH** | 29.2553 **MGT** | `2.448008` | **9** | **9** | **0** |
| `0xA4Fe6881De397b788CD355Bf8098d095e5E852cB` | **PUNTOS / MGT** | 0 **PUNTOS** | 0 **MGT** | `0` | **0** | **0** | **0** |
| `0xE2dCC5495694A1414a3bebafCBa67F4ccfeA4164` | **WETH / TPC** | 0.0332 **WETH** | 7.4753 **TPC** | `0.497352` | **5** | **2** | **0** |
| `0x31114610bFD8821D3f7dfC8eBE9e1c5cC407e124` | **MGT / TM** | 0 **MGT** | 0 **TM** | `0` | **0** | **0** | **0** |
| `0x9C3b0b7C34FC20436B7A3004039d3878e1E4477D` | **WETH / EDU** | 0 **WETH** | 0 **EDU** | `0` | **0** | **0** | **0** |
| `0xD56815eDd0E17eA5c89999a9144b753A12a7B266` | **TKND / EDU** | 0 **TKND** | 0 **EDU** | `0` | **0** | **0** | **0** |
| `0x7c4351cD7607fbcD53cBc7231EBcAca2b6C66E18` | **ITA / TKND** | 0 **ITA** | 0 **TKND** | `0` | **0** | **0** | **0** |
| `0x303eEef65A55997532f84E3340069A4Af4177348` | **MGT / TKND** | 0 **MGT** | 0 **TKND** | `0` | **0** | **0** | **0** |
| `0x56de6e5a5a903a788174931CDc834a00aAb19EdB` | **TKC / JALI** | 0 **TKC** | 0 **JALI** | `0` | **0** | **0** | **0** |
| `0xa88c0F0b474911Da1220aE5F0489A8B899EDe26e` | **EDU / TKND** | 0 **EDU** | 0 **TKND** | `0` | **0** | **0** | **0** |
| `0x890F6553476010A2dBEbB1D72B7795F616dDe7f4` | **EDU / EDU** | 0 **EDU** | 0 **EDU** | `0` | **0** | **0** | **0** |
| `0x0f3Dd809c75355E8DE0d49961187123874eF74cb` | **WETH / ACT1** | 0.2007 **WETH** | 1098.2974 **ACT1** | `14.778777` | **12** | **12** | **0** |
| `0x78Af01Bde08D5b16E072ED56c364B5E4F02E8Ae8` | **EDU / ACT1** | 0 **EDU** | 0 **ACT1** | `0` | **0** | **0** | **0** |
| `0x7828A38A805ca9F3a41eF20e6865e3d5C64E57C3` | **MPCH / JALI** | 34.1954 **MPCH** | 0.0500 **JALI** | `1.307582` | **0** | **1** | **0** |
| `0x0fb253700da402aEBB1ea2B642A85925fb24Ba43` | **WETH / EDU** | 0 **WETH** | 0 **EDU** | `0` | **0** | **0** | **0** |
| `0x2A1fA062BaAa194F616c4f3f6eb2fe517b5421BB` | **TKGIO / JALI** | 0.0037 **TKGIO** | 0.1349 **JALI** | `0.022361` | **1** | **2** | **0** |
| `0xA366e25F758c6f9953C6eeb8302803F40f08f1e1` | **PUNTOS / JALI** | 0 **PUNTOS** | 0 **JALI** | `0` | **1** | **1** | **1** |
| `0xd11b93a61bBCE8d99dC513B19e9Bd30dBCC5B971` | **WETH / VTC** | 9.5288 **WETH** | 14660.7351 **VTC** | `373.471869` | **4** | **24** | **1** |
| `0xda7a193659eE454A6E610582B5ca63D0094A37A4` | **ACT1 / 5TOK** | 0 **ACT1** | 0 **5TOK** | `0` | **0** | **0** | **0** |
| `0x0C6c2F4f0Bcaaa14795470FAd4182b83b9447783` | **WETH / JALI** | 0.4496 **WETH** | 0.0351 **JALI** | `0.125374` | **2** | **2** | **0** |
| `0xADA9866A38B5E8526Ba744045DEe9db8fd054e9C` | **WETH / VTC2** | 0.2000 **WETH** | 0.0000 **VTC2** | `0.0002` | **1** | **2** | **0** |
| `0xcBEA3f7946e8A405232Fb60087dc1fF6e1d73261` | **WETH / CBCH** | 0.3994 **WETH** | 1000 **CBCH** | `19.97` | **1** | **2** | **0** |
| `0x7C52de65448623104e2CA949cC9C8487cD8879Ae` | **CBCH / PESO** | 0 **CBCH** | 0 **PESO** | `0` | **0** | **0** | **0** |
| `0xbB4A3536FDd00f8250229187CDfFE3e42C526314` | **JCH / CBCH** | 0 **JCH** | 0 **CBCH** | `0` | **0** | **0** | **0** |
| `0x23e05FE714e990cBFD8fCa086413FbeF5257Da50` | **ING / WETH** | 0 **ING** | 0 **WETH** | `0` | **0** | **0** | **0** |
| `0xf42004CaEb641C28F21C0ad8c795F4186243734e` | **WETH / TK2** | 0.0274 **WETH** | 483.6525 **TK2** | `3.637868` | **3** | **4** | **0** |
| `0x40A44B8C5d93F8866F5294f55E748D6beC231109` | **VTC / EDU** | 0 **VTC** | 0 **EDU** | `0` | **0** | **0** | **0** |
| `0x06A4A0f41c80E1d10006f632a5B16DAB0aC8495c` | **VTC / EDU** | 0 **VTC** | 0 **EDU** | `0` | **0** | **0** | **0** |
| `0xB9Cae63B049e9fA3e56Bf6F71c569708EE37D516` | **EDU / VTC** | 0 **EDU** | 0 **VTC** | `0` | **0** | **0** | **0** |
| `0xEa5c6A67209D8Dc02d0f224596Ee02F105CF3221` | **VTC / VTK** | 0 **VTC** | 0 **VTK** | `0` | **0** | **0** | **0** |
| `0x9D6c72817d2eEf324785d58365D5D037Df16933E` | **VTC / PESO** | 1 **VTC** | 0.1000 **PESO** | `0.316228` | **0** | **1** | **0** |
| `0x4dF39945BF6CE8b86Db22064C2B60a9a032046E8` | **WETH / JCH** | 0.0012 **WETH** | 3.0085 **JCH** | `0.06008` | **1** | **3** | **0** |
| `0x74851956CE90EC5DFbeFc3Af4A6e166Ef79c9986` | **PUNTOS / WETH** | 1.0001 **PUNTOS** | 0.0000 **WETH** | `0.000305` | **2** | **5** | **0** |
| `0x89A0111D0491ad7279E9E9396266E6cb81E6e3d7` | **TKC / CLT** | 0 **TKC** | 0 **CLT** | `0` | **0** | **0** | **0** |
| `0x294aF235ffFf363630574C9d34906649078F386a` | **WETH / CLT** | 1.3073 **WETH** | 0.0000 **CLT** | `0.00384` | **1** | **3** | **1** |
| `0x960F7e83124BDC9eA9ac7D9d92b3d016B9465d1D` | **VTC2 / VTC5** | 0 **VTC2** | 0 **VTC5** | `0` | **0** | **0** | **0** |
| `0x99F1D2C77c0AFDF0C27Fa0b9A8A9a5Ff2b1db2B6` | **CLT / MACONDO** | 0 **CLT** | 0 **MACONDO** | `0` | **0** | **0** | **0** |
| `0xC06E78AF27Fc5732FE9487c8DAC7Ed4Edd07ffc2` | **WETH / DEI** | 0 **WETH** | 0 **DEI** | `0` | **0** | **0** | **0** |
| `0x1aDE7B55eAbBb80AFfFc3D429306eAD443A4e7Ab` | **WETH / ICE** | 0.4878 **WETH** | 99861.5944 **ICE** | `220.678377` | **4** | **6** | **0** |
| `0x867aE5cFE679Ded95dE2874D561537d43f5E4037` | **MPCH3 / WETH** | 0 **MPCH3** | 0 **WETH** | `0` | **0** | **0** | **0** |
| `0x012109eEC9a606d30360f978ba265c1b1aCa2A44` | **TPC / MPCH** | 0 **TPC** | 0 **MPCH** | `0` | **0** | **0** | **0** |
| `0xF475d6612b5849f70f9E5861577e86D7F2BB7836` | **WETH / pltk** | 0.2117 **WETH** | 19.0749 **pltk** | `2.002954` | **4** | **8** | **1** |
| `0xb2882Cc091b834FBE466c1a16Ffb53C9C815D612` | **MTT / TKND** | 0 **MTT** | 0 **TKND** | `0` | **0** | **0** | **0** |
| `0xF2733D67299DDE2E32A034F1e4e49506f8dB22F6` | **pltk / TKND** | 0 **pltk** | 0 **TKND** | `0` | **0** | **0** | **0** |
| `0x665E4Ae2A2201b9046753695755902aF5562A2Ff` | **WETH / TR** | 0 **WETH** | 0 **TR** | `0` | **0** | **0** | **0** |
| `0x1a1b6CE179012eEbA7a0bAB838289CD65BA34B9b` | **MTT / WETH** | 4.1688 **MTT** | 0.6000 **WETH** | `1.581139` | **1** | **1** | **0** |
| `0x0D77225dcf05B8345C33210e169dfEA35Bb001Ee` | **WETH / Nkc** | 0 **WETH** | 0 **Nkc** | `0` | **0** | **0** | **0** |
| `0xe1a3d6cFe17Dc7C5FDde249118008D4C32AAfA39` | **PUNTOS / Nkc** | 5.1451 **PUNTOS** | 7 **Nkc** | `6` | **1** | **1** | **0** |
| `0x00E4cd3c3dFe1D0D032450bE92DC9bacf7b106e2` | **WETH / pltk2** | 0 **WETH** | 0 **pltk2** | `0` | **0** | **0** | **0** |
| `0xF83Aaf70d2A7Fda316756DEFDc02fAc38776203f` | **WETH / TKND** | 0.0534 **WETH** | 4990.6636 **TKND** | `16.317684` | **2** | **2** | **0** |
| `0xE4F7086a449F49641E2dB3d7614D0B46d7bA0643` | **SAD / PUNTOS** | 0 **SAD** | 0 **PUNTOS** | `0` | **0** | **0** | **0** |
| `0x940B854d405A72c58A6dB042D02cBDc54109beDc` | **PUNTOS / PESO** | 0 **PUNTOS** | 0 **PESO** | `0` | **0** | **0** | **0** |
| `0xc38755eF4ffA6d30D5823Ae619D34BA6e8B63fBA` | **PUNTOS / VTK** | 0 **PUNTOS** | 0 **VTK** | `0` | **0** | **0** | **0** |
| `0x2B26dEebbB5d86487Ab18315498aE46C054e29a6` | **SAD / PC** | 0 **SAD** | 0 **PC** | `0` | **0** | **0** | **0** |
| `0x2200b4688f482f7c96c03de405E5bDC50e1A8EdE` | **SAD / WETH** | 6000.0500 **SAD** | 0.0012 **WETH** | `2.683304` | **0** | **3** | **0** |
| `0x44069BB23f1F3b8388514837e5B31A7DD141B606` | **WETH / MT** | 0.5000 **WETH** | 1000 **MT** | `22.36068` | **0** | **1** | **0** |
| `0xB2817A062C453F012d23C5C78b0b992fa49e6eA4` | **WETH / TKGIO2** | 0 **WETH** | 0 **TKGIO2** | `0` | **0** | **0** | **0** |
| `0xC480E78Cd28bE7245f946053F2aaab7a62482b0c` | **TKGIO2 / TKGIO** | 0 **TKGIO2** | 0 **TKGIO** | `0` | **0** | **0** | **0** |
| `0xC55fC51605faee203f9Bc1146046C03C0d8F75e2` | **CHC / PESO** | 0 **CHC** | 0 **PESO** | `0` | **0** | **0** | **0** |
| `0xCa57Ec18B3ac528682F4061F76176Dd21Aa28604` | **WETH / TKND1** | 0.0020 **WETH** | 500 **TKND1** | `1` | **0** | **1** | **0** |
| `0x9dB2076163d285f1112Ad41883bdbe1118151E4B` | **WETH / PC** | 0 **WETH** | 0 **PC** | `0` | **0** | **0** | **0** |
| `0xD566fc675B9E53884a5acA3C48f352E5170E2dAe` | **PESO / TKGIO** | 0 **PESO** | 0 **TKGIO** | `0` | **0** | **0** | **0** |
| `0x27186cC6dE69A7f3ae76139d7F8b4171b918C794` | **MGT / CBCH** | 0 **MGT** | 0 **CBCH** | `0` | **0** | **0** | **0** |
| `0x4A8615b6184010F695a2D1A0B55766238899c9f4` | **JFER / UTP** | 0 **JFER** | 0 **UTP** | `0` | **0** | **0** | **0** |
| `0x97B8182571CB6D86EBe2276b797a23A6974df9d5` | **LUQUITA / WETH** | 0 **LUQUITA** | 0 **WETH** | `0` | **0** | **0** | **0** |
| `0xd901f3bbb0ee1fd846E1E871A5Cd3cd79189c8be` | **MPCH / ITA** | 0 **MPCH** | 0 **ITA** | `0` | **0** | **0** | **0** |
| `0x6c0545609875976a3Db2a54Fc596412F582e87a2` | **JFER / MACONDO** | 0 **JFER** | 0 **MACONDO** | `0` | **0** | **0** | **0** |
| `0x4D1BFf54F176743bEddb44f7B71E710F56eF89C6` | **MGT / TKGIO** | 0 **MGT** | 0 **TKGIO** | `0` | **0** | **0** | **0** |
| `0x5b0B4Aaac34d41A7F85d5dc0391855bCD879e820` | **JFER / WETH** | 1.1000 **JFER** | 0.0055 **WETH** | `0.077782` | **0** | **2** | **0** |
| `0xea8503c73492A6B524F92746CDE45FF04E5f01E7` | **UTP / JTK** | 0 **UTP** | 0 **JTK** | `0` | **0** | **0** | **0** |
| `0x9d746F20e109076d157948fC154A060162Ecc1a1` | **WETH / JTK** | 0 **WETH** | 0 **JTK** | `0` | **0** | **0** | **0** |
| `0x02aA0cC330591dF11972C08168F75B4876D3D857` | **CHC / WETH** | 9337.5021 **CHC** | 0.6720 **WETH** | `79.191717` | **1** | **2** | **0** |
| `0x7b0D888c1515E0ed5D9D0f69698fD370b73F1e46` | **sad / WETH** | 0 **sad** | 0 **WETH** | `0` | **0** | **0** | **0** |
| `0x13D9504dD3D4Bd6045f9CC80dA926148a12d0ADE` | **JFER / ITA** | 0 **JFER** | 0 **ITA** | `0` | **0** | **0** | **0** |
| `0x8A19e4B60071C7B658188465f842e3B0fB87e195` | **WETH / cclt** | 0 **WETH** | 0 **cclt** | `0` | **0** | **0** | **0** |
| `0x0FFF02008dC29B4063b61Ed6bb59F27Dc1097Eae` | **Nkc / MACONDO** | 0 **Nkc** | 0 **MACONDO** | `0` | **0** | **0** | **0** |
| `0x37198F46E72266398d0A421d233Ad1Df4bC13f9C` | **SAD / TKGIO** | 0 **SAD** | 0 **TKGIO** | `0` | **0** | **0** | **0** |
| `0x1de9963F7877b42823ac1757ec1C7e0a748A93Cd` | **SAD / FIRE** | 100 **SAD** | 17 **FIRE** | `41.231056` | **0** | **1** | **0** |
| `0x333802c05083850f73FB49b653e92F3020793E84` | **PUNTOS / JTK** | 0 **PUNTOS** | 0 **JTK** | `0` | **0** | **0** | **0** |
| `0x79d41d0F124a0825535733a43Db3954C900156f5` | **WETH / TKGIO3** | 0 **WETH** | 0 **TKGIO3** | `0` | **0** | **0** | **0** |
| `0x01F32Eaa8059e9F98345c4D6253C8dAe904F8317` | **TKGIO3 / TKGIO** | 0 **TKGIO3** | 0 **TKGIO** | `0` | **0** | **0** | **0** |

---

### Actividad de Tokens Creados ([TokenFactory.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/TokenFactory.sol) y [BaseERC20.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BaseERC20.sol))

El número total de tokens personalizados creados por los estudiantes a través de la fábrica de tokens asciende a ciento quince activos, detallando a continuación el suministro total y el bloque de despliegue para cada uno de los contratos instanciados.

| Token (Dirección) | Nombre | Símbolo | Creador (Owner) | Suministro Total | Bloque |
| :--- | :--- | :---: | :--- | :---: | :---: |
| `0x1D2ac77A7b8243A6e29EB7E781Ce6B3E295EFe65` | **Puntos del profe** | **PUNTOS** | `0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772` | 100000.0 | 10968872 |
| `0xe7864240cAC19939D4EA68C5EFb4B636A8BbDf02` | **El Estable Peso** | **PESO** | `0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772` | 100000000.0 | 10968907 |
| `0x074367Cd77370D869C0894508E314091960662B2` | **USACH Token de Prueba** | **UTP** | `0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772` | 0.0 | 10969292 |
| `0xF41E16256f8d383a9BDDA38a99B899146448C23b` | **Macondo Token** | **MACONDO** | `0x5953D009299f31fac1d7B08176Cc7a7A571405Cb` | 500000.0 | 10976167 |
| `0xa897009E017F1Bf7Fa72f3C19ad0e7295858F64C` | **Vinitok** | **VTK** | `0x760f11004aa59d898913E5aE768C648004f3bf47` | 10000000.0 | 10984778 |
| `0x8D1039Ce5d05E71fAaCDC6053F509081B5B1341F` | **Tokenmpino** | **MPCH** | `0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B` | 110731612.545 | 11008690 |
| `0xF02fb0D52Fc59549eE5fDC19bb70426D0879bbf6` | **Token Giovi** | **TKGIO** | `0x42ddE3F6ae39066b79767261AFD4Cb2c3d82eA96` | 2273000.0 | 11011603 |
| `0x9264698E11bb73484BA821945b81BcaD13095897` | **ITACHI TOKEN** | **ITA** | `0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68` | 500.0 | 11018800 |
| `0xF703ea88880C1a7b221887BbB321e8dDECD9d822` | **JALI Token** | **JALI** | `0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C` | 1.0 | 11030329 |
| `0x6B09665Afa3540f8CD8296E47DbB0445ef155f47` | **USACH TRAINING TOKEN** | **UTT** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 3.000011 | 11031382 |
| `0xff7A19b2d03F13f589Ff94219b32ffaEF2CF0336` | **TokenMarti** | **TM** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 1000.0 | 11031726 |
| `0x54C13E6Cb025C9C8883c1705F1689cB76de93c45` | **Token Repartido** | **TR** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 300.0 | 11031736 |
| `0xff7A19b2d03F13f589Ff94219b32ffaEF2CF0336` | **TokenMarti** | **TM** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 1000.0 | 11031726 |
| `0x54C13E6Cb025C9C8883c1705F1689cB76de93c45` | **Token Repartido** | **TR** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 300.0 | 11031736 |
| `0xc66e8C8a0d80092B183C7fBF1d6f77d5bF13C611` | **Polito Coin** | **PC** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 150.0 | 11031754 |
| `0x61Dec1630F12d67336E29224fc4137d740bA338a` | **TPQ COIN** | **TPC** | `0x3a211d4a5638E9dCEa893e7Be4b1E3ce157C0B39` | 75.1 | 11031761 |
| `0x3d0FDfC08B1484AE8499aF03cD744B8c7c3c6d15` | **GTO** | **FIRE** | `0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f` | 21110000101.0 | 11033006 |
| `0xDDfd545b0c3F03705A4cDdcec72AaA2D8BbB7324` | **Tokenmpino2** | **MPCH2** | `0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B` | 50134100.0 | 11033173 |
| `0xe49cCdD0C0b15E8461Cf01ABE488B67A41373D29` | **CuboChain** | **CBCH** | `0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0` | 100010050.0 | 11033535 |
| `0x0F2c4fB4c90F2335AA7384601c22B35706536fFf` | **Mi Nuevo Tokencito** | **TOKENCIT** | `0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772` | 100000.0 | 11033581 |
| `0x885E5E5e6E1C492A6bceE71bA563906b293D3E19` | **MiguelToken** | **MGT** | `0xA78B57234A481d69393381Ac1642DBCadd9B66F1` | 50000000.0 | 11037968 |
| `0x00762e749183Bd546Ae873068Fa12d1beBA9970e` | **MiguelToken2** | **MGT2** | `0xA78B57234A481d69393381Ac1642DBCadd9B66F1` | 0.0 | 11044704 |
| `0xA6D6ce791452D498aE77c1Cf5680560e8121741d` | **MCToken** | **MCT** | `0xA78B57234A481d69393381Ac1642DBCadd9B66F1` | 0.0 | 11046051 |
| `0xad44825479b4d8701e215A82cb4b977b955434de` | **TokenMIG** | **MIG** | `0xA78B57234A481d69393381Ac1642DBCadd9B66F1` | 0.0 | 11046066 |
| `0x07FE3FB30C77B9a2B6C18c3e4391b4c03Bbcf668` | **TokenContreras** | **TKC** | `0xA78B57234A481d69393381Ac1642DBCadd9B66F1` | 0.0 | 11046069 |
| `0x30C5641E47FF1CAE9d16fb27A8C505FdfA65A107` | **Tokenmpino3** | **MPCH3** | `0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B` | 12.0 | 11046114 |
| `0xc0A28AaDD6f11eB96E88a6f3BabdD7dF9ED2cEe8` | **Tokenmpino4** | **MPCH4** | `0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B` | 0.0 | 11046117 |
| `0x392065Aa52d52bBF8dEcF4BE7b5E93a154F58831` | **Tokenmpino5** | **MPCH5** | `0x1B3443521CbB39b85bC3e4510f3B3b6eC315D90B` | 400.0 | 11046119 |
| `0xBd5cBd08D644f1C5ef9282b2A19B5a7eEcCeA008` | **Romi token** | **EDU** | `0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE` | 2000.0 | 11046697 |
| `0x53D4B3288c1c7EF9374d753047873C8b0cfC8c46` | **Romi token** | **EDU** | `0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE` | 0.0 | 11046755 |
| `0xB8aAEA24217c8BB49b599d24Dc89671e8bC9EAe2` | **Token NicolasD Usach** | **TKND** | `0x82528840954594A11855a1fDA9b19AEda6BCEa4F` | 100001.0 | 11047046 |
| `0x83f1273FF47977b271150B8A3C84097Ca633bBaF` | **polettoken** | **pltk** | `0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3` | 10013.5 | 11047429 |
| `0x851F39c69D76F804F9b48F30f780daAb935b8C82` | **OBITO TOKEN** | **OBI** | `0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68` | 2000.0 | 11047612 |
| `0x5c890252491c1422407B1243a50c3B0499499ADA` | **DEIDARA TOKEM** | **DEI** | `0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68` | 41000.0 | 11047619 |
| `0x4048efEA132a61A0d91F73755Eda7233598f16fe` | **SASORI TOKEN** | **SAS** | `0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68` | 3000.0 | 11047648 |
| `0x579512232FC24Fc336295EB60063A44720a3534E` | **PAIN TOKEN** | **PAIN** | `0xC00B07476a6F2Fc3a3eDE442652FBcc694CCfB68` | 4999.0 | 11047651 |
| `0x9ADEC62F91687f552A6C32B9f8Bde7DD1452AB8B` | **Activo 1** | **ACT1** | `0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF` | 110000.0 | 11047756 |
| `0x9a5B80895920E1F08AA9FC9867Ab02Bb97c9C4F3` | **ColoToken** | **CLT** | `0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42` | 0.001001 | 11048323 |
| `0xbD06f4509D100e4b9C8194Bed26b5AB0d3184b92` | **TOKEN2** | **TK2** | `0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF` | 50000.0 | 11048354 |
| `0x7B8E29daE661038FB23E4deF0f51b20401C36153` | **TOKEN3** | **TK3** | `0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF` | 50000.0 | 11048393 |
| `0x8553C7b94bcFc01fFcf2D5CF49d35D999B1Fe832` | **Romi 3** | **EDU** | `0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE` | 0.0 | 11051821 |
| `0x60989F8754f1200dcD0682F597cdB35F108d9455` | **Romi 4** | **EDU** | `0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE` | 0.0 | 11051824 |
| `0xD620f53254D81047832af39F76012F3E68d797DC` | **Romi 5** | **EDU** | `0x9e034CcB8407101B4FEd0D52D13b6D02aFa021dE` | 0.0 | 11051831 |
| `0x743b4728b6895C8957d458b023C6F90E458D1D24` | **VitokoCoin** | **VTC** | `0xf133e655555711E25CD9723a8e83A7C53a5D91a4` | 18200.000001 | 11053658 |
| `0xEfe25AF379590A11305A7C1126aCa78130ab2b24` | **JALI 2** | **2TOK** | `0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C` | 0.0 | 11053756 |
| `0xa29392DcAf374f34350c5bff19F9E6e5C9adc6BB` | **JALI 3** | **3TOK** | `0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C` | 0.0 | 11053763 |
| `0x3b2A8823a920FcAd5f3cD0CCdCF28859579D0D2d` | **JALI 4** | **4TOK** | `0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C` | 0.0 | 11053766 |
| `0xAc734f791BcA775a9A3116d34F5aE22Ac7D09A38` | **TOKENTO** | **TOKEN** | `0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF` | 0.0 | 11053768 |
| `0xe577aD4374C1649C012ecFD82d047FC2AC283534` | **JALI 5** | **5TOK** | `0x1D14B5D0D290669741B9df14b2c4B69b3Ad0423C` | 0.0 | 11053769 |
| `0xc0F09E0c91A9a023b7d9932b741004E88DD55743` | **TOKENTO1** | **TOKEN1** | `0x87A7ef686037a25DFd53a5d7400657f09b2ce4AF` | 0.0 | 11053771 |
| `0x0F2DAF399f29CC57E10760a746B04434c9e0466B` | **SIRALID** | **SAD** | `0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121` | 50000.0 | 11053809 |
| `0x513A9a6BCA3Fb7cDB8Cb82DCfB5e820C9B070E7f` | **VitokoCoin 2.0** | **VTC2** | `0xf133e655555711E25CD9723a8e83A7C53a5D91a4` | 50.0 | 11053837 |
| `0x8Ea5bF9b72b148Aa059b464719007C36e22EdEC7` | **VitokoCoin 3.0** | **VTC3** | `0xf133e655555711E25CD9723a8e83A7C53a5D91a4` | 1080.0 | 11053851 |
| `0x2662aA461fc7DF9eeeB6f66f1c38aF00c97048A1` | **Empanada 1** | **ING** | `0x0e51080164B5Eb3F028D6A85deF9273457093c70` | 50000.0 | 11053867 |
| `0x384435f6659185FC6a2701C9964409Ff6577a20D` | **Mil Pesos Token** | **LUQUITA** | `0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772` | 1000000.0 | 11053934 |
| `0x872BC57A7bdF3A58567a9A4cD735107e16c6B5C6` | **JanoChain** | **JCH** | `0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0` | 1000.0 | 11054060 |
| `0x8E4f8aCF9e60F20955eC21a50AB248DF2dF77F8B` | **Jano Token** | **JTK** | `0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0` | 1000.0 | 11054082 |
| `0x08769a798B2b20a2513958160Ef72859D457D80B` | **CuboChain v2** | **CBCH2** | `0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0` | 0.0 | 11054156 |
| `0x0C2da75158849ed6aA5D1F2992b9125ef566Bf04` | **CuboChain v3** | **CBCH3** | `0x209D191B60AAa4Dd8452BF42DaDC5D68aea385F0` | 0.0 | 11054172 |
| `0x416Fe11bB9bACe290402a2193ca0C2A15a653D9E` | **Vitoko Coinc 4** | **VTC4** | `0xf133e655555711E25CD9723a8e83A7C53a5D91a4` | 18500.0 | 11054257 |
| `0xC67584882f0a742f787cF965739558Ab3d1d52f4` | **VitokoCoin 5.0** | **VTC5** | `0xf133e655555711E25CD9723a8e83A7C53a5D91a4` | 234585.0 | 11054347 |
| `0xCB6f07A9bC0ACAC9D8087956FB36B8e036609B60` | **GTO2** | **ICE** | `0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f` | 100000.0 | 11055438 |
| `0x697DFb7820675C66F322f0d6c7D4015bC01995d5` | **GTO3** | **EARTH** | `0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f` | 0.0 | 11055441 |
| `0xb0229D8E66ed89145C222495C1946196d6C4e70B` | **GTO4** | **WIND** | `0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f` | 0.0 | 11055444 |
| `0xdf4fcF6e42CbF0A1dFCD42713a2D7cF3F591E095` | **GTO5** | **STEEL** | `0xcDA61b6aC1207262e38585cDffE2ea87a70c4e4f` | 0.0 | 11055750 |
| `0x85BFEe5d18f39e7aE8551eC0B91b3d8D906a0CdF` | **polettoken1** | **pltk1** | `0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3` | 100000.0 | 11059856 |
| `0xAf12B1B8512C586caC71e8e621078DC6fc331103` | **polettoken2** | **pltk2** | `0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3` | 0.0 | 11059859 |
| `0x1bd93f2180af48Fb8f15f2BFDa3792FfFaC7F595` | **polettoken3** | **pltk** | `0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3` | 0.0 | 11059873 |
| `0x0592D92BD2f396F35339C561F0e700e32d9a6ddd` | **MiToken** | **MTT** | `0x131B7E72CdD02717F74E1529ae4Ecb7C2dD39a4A` | 100000.0 | 11060908 |
| `0x35d57e5254459838F7656EdBD5ecC6702DFFBC70` | **MiSupertoken** | **MST** | `0x131B7E72CdD02717F74E1529ae4Ecb7C2dD39a4A` | 0.0 | 11060937 |
| `0x70bb884Fc94ae0d4DB62667D402B92bB1B97FE95` | **MiToken2** | **mt2** | `0x131B7E72CdD02717F74E1529ae4Ecb7C2dD39a4A` | 0.0 | 11061010 |
| `0x59ea06d9725b2dc69561C7Ac1AE36867B94e508c` | **NekrodamusCoin** | **Nkc** | `0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5` | 100100.0 | 11061152 |
| `0x6bd08C18264b67454728c2cf4DE1BCF7335dbFcB` | **polettoken4** | **pltk4** | `0x4479C1b9c40bBDa0473cE1757a7b1cCf1a6bDcD3` | 0.0 | 11061508 |
| `0xEBe2A82052958bCb3E5E23f70Fd3214c5B8168c5` | **Monkey Token** | **MT** | `0x5bac18695637fbD41D5d64dCb93dc54D66FEEbf3` | 1000000.0 | 11062608 |
| `0x11E0327F22e33cD07B7b87248D9e085a4bEF68C6` | **siralid2** | **sad** | `0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121` | 0.0 | 11064294 |
| `0x51529621Ffe1f8FdDdcd00568E2F7E43219367b1` | **TokenGio2** | **TKGIO2** | `0x42ddE3F6ae39066b79767261AFD4Cb2c3d82eA96` | 150000.0 | 11065651 |
| `0xD525d49CBC158fa563B4E134e4661770dfF6e146` | **TokenGio2** | **TKGIO2** | `0x42ddE3F6ae39066b79767261AFD4Cb2c3d82eA96` | 0.0 | 11065654 |
| `0x813Bbc2c125dfA5ED616F2908b8149ED75774a1C` | **TokenGio3** | **TKGIO3** | `0x42ddE3F6ae39066b79767261AFD4Cb2c3d82eA96` | 200000.0 | 11065659 |
| `0x9d6c338713384Ac1a9b3314fC93958f40E44d47F` | **Empanada 2** | **ING1** | `0x0e51080164B5Eb3F028D6A85deF9273457093c70` | 0.0 | 11068097 |
| `0xaFabbAba15989Be7a80f4442C61c8d2fD2f590be` | **Empanada 3** | **ING 2** | `0x0e51080164B5Eb3F028D6A85deF9273457093c70` | 0.0 | 11068201 |
| `0x5c4F73884d7D405A433B3d3E4dAf699407F49a77` | **Empanada 4** | **ING 3** | `0x0e51080164B5Eb3F028D6A85deF9273457093c70` | 0.0 | 11068215 |
| `0x6F4FD8Ed9eC621B8Df3Aff94f8403eF4A6440302` | **Empanada 5** | **ING 4** | `0x0e51080164B5Eb3F028D6A85deF9273457093c70` | 0.0 | 11068257 |
| `0x1810b6323D188192e5b51b76FB25112a852dDb65` | **Chococoin** | **CHC** | `0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df` | 1010000.0 | 11068440 |
| `0xF21Fe83B3BaEF9805f505C56d8Df6394c93a8e20` | **Tok NicolasD1 ** | **TKND1** | `0x82528840954594A11855a1fDA9b19AEda6BCEa4F` | 100000.0 | 11069192 |
| `0x8989664f8694f04D18cfA8a88b398a5FDeB9BD53` | **Siralid3** | **sad3** | `0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121` | 0.0 | 11069642 |
| `0x766353FaBc86F2477b85ad9624cEFF12FdbE3b34` | **siralid4** | **sad4** | `0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121` | 0.0 | 11069645 |
| `0x082CF8E97Cddf6CD7da2e304a094569b477E8aF0` | **siralid5** | **sad5** | `0x8376F6eef5362cCd91c7F2Ecae8B02Ca02043121` | 0.0 | 11069650 |
| `0x3fA5713F551408e2aBFD542132010E9dae8ac528` | **NekrodamusCoin2** | **Nkc** | `0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5` | 0.0 | 11069705 |
| `0x000369d31eaba0e27f95500c8Ff06398084159C8` | **FerreiraToken** | **JFER** | `0x684858C2072Ef9eE7269B81d348a627956c44382` | 1081.0 | 11069969 |
| `0x660E1fCf8662A795C3294f66FEBC311090d4dEe5` | **TokenGio5** | **TKGIO5** | `0x42ddE3F6ae39066b79767261AFD4Cb2c3d82eA96` | 0.0 | 11070056 |
| `0x9bBa32Cf3D6756c3F62abe0707dD2583c5Da6223` | **NekrodamusCoin3** | **Nkc** | `0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5` | 0.0 | 11076447 |
| `0x4dd50Ec4F14bEB9d8319E81f32A9A5b5a4960598` | **NekrodamusCoin4** | **Nkc** | `0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5` | 0.0 | 11076478 |
| `0x4aadF52Be02C8D2057335FB20CDECB841cC06235` | **NekrodamusCoin5** | **Nkc** | `0xeC006BA3EA4cA637cea06027b5e68Bf99062A5F5` | 0.0 | 11076483 |
| `0xa58ce92704A45eb95057233F7Ee6957097d5b88d` | **JohnToken** | **JTK** | `0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce` | 0.0 | 11077085 |
| `0xeAf71a43d06c28c5918C687FE9F527cA9E48aB02` | **Colo91Token** | **C91** | `0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42` | 0.0 | 11077255 |
| `0xB7D67cb855630686347081f20F379E3B2e346AB0` | **colocolito** | **cclt** | `0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42` | 0.0 | 11077258 |
| `0x63eaD51961F67299767CfF1CaB3F73d912cdC138` | **albotoken** | **atk** | `0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42` | 0.0 | 11077260 |
| `0x4A6a1184E6A5F44C43cbF812531140E087e32ab3` | **negroyblanco** | **nyb** | `0x5EB6Cd3cEAE4548a459E0F255aD4d1bda4f05c42` | 0.0 | 11077264 |
| `0xa1e12914AC54f2de1BdE85c85DECf80852a18dFD` | **Chococoin2** | **CHC2** | `0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df` | 0.0 | 11081650 |
| `0x3c157Bc5A7514bD2C6842664a8112AF9d5afA5f6` | **Chococoin3** | **CHC3** | `0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df` | 0.0 | 11081653 |
| `0x9b601C6b71bCB06349f5bBC41F0F89B907036155` | **Chococoin4** | **CHC4** | `0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df` | 0.0 | 11081656 |
| `0x7d8C754181516fF10fb008601A07597e53870066` | **Chococoin5** | **CHC5** | `0x5155c3d1F537b094B42BCc4e3cfB295b10F4A7Df` | 0.0 | 11081659 |
| `0xD690914dC58685c9eca5388a211F75d7906efFBc` | **ELTK** | **ELT** | `0x131B7E72CdD02717F74E1529ae4Ecb7C2dD39a4A` | 0.0 | 11082028 |
| `0x8CFcd77AeD7dBE30bCd724F91f6D6D772F221b43` | **Uasachto** | **TSC** | `0x131B7E72CdD02717F74E1529ae4Ecb7C2dD39a4A` | 0.0 | 11082035 |
| `0x463Ef9Ea5dCC55d750b3ED84662dEbabE90627d7` | **TokenFerreira** | **TKF** | `0x684858C2072Ef9eE7269B81d348a627956c44382` | 0.0 | 11082093 |
| `0x3e8d9a6b48C371D1F504BBbb6755Fce2364678a7` | **Tokunista** | **RPCTOKEN** | `0x684858C2072Ef9eE7269B81d348a627956c44382` | 0.0 | 11082099 |
| `0xe902b028E0571042ec0Ce06022D8aE7957A0359e` | **TokBoric** | **FATOK** | `0x684858C2072Ef9eE7269B81d348a627956c44382` | 0.0 | 11082103 |
| `0xC64E59CE30501e8FeE88bb2F20a3976A3F896758` | **Alumno Token** | **ALUT** | `0x684858C2072Ef9eE7269B81d348a627956c44382` | 0.0 | 11082108 |
| `0x82F54Ffe9794d7F7D7ec2EE84E2fb6080D7c8b3C` | **Jamon** | **JMN** | `0x4a221EbA41A6252c6aDd914eb25c68E797c783bf` | 100000.0 | 11083388 |
| `0x5D8d5eb19fE2aF5eE71563bbeC7aF723a4C68B0A` | **CAPUCHINO TOKEN** | **MCT** | `0x5bac18695637fbD41D5d64dCb93dc54D66FEEbf3` | 0.0 | 11084191 |
| `0xCBdD236D360206a75C6F65B52ae23D41d1b01BA4` | **MACACO NEGRO TOKEN** | **MNT** | `0x5bac18695637fbD41D5d64dCb93dc54D66FEEbf3` | 0.0 | 11084197 |
| `0xb74b7dDd05446319bEfF0605332345613196Dd66` | **MONO AULLADOR TOKEN** | **MAT** | `0x5bac18695637fbD41D5d64dCb93dc54D66FEEbf3` | 0.0 | 11084203 |
| `0x00AFf37240E6c93E09D71708AC8c49783Bff6F3b` | **TITI PIGMEO TOKEN** | **TPT** | `0x5bac18695637fbD41D5d64dCb93dc54D66FEEbf3` | 0.0 | 11084220 |
| `0x1161970A04F571d78D40eCd6b0d895494a488974` | **JohnToken2** | **JTK2** | `0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce` | 0.0 | 11084781 |
| `0x7EeF8f5Be615B0885A38a6e2B9f8Bde7DD1452AB8B` | **JohnToken3** | **JTK3** | `0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce` | 0.0 | 11084784 |
| `0x54f8A5c559E263D7095FD5b5fe04Fa59D69eD6A7` | **JohnToken4** | **JTK4** | `0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce` | 0.0 | 11084788 |
| `0x5e2f49CcCd3dF2FB9D4BD796679C86f908E5C1Fa` | **JohnToken5** | **JTK5** | `0xe52A8FC5c172e38B48C15895B1e987f19DB203Ce` | 0.0 | 11084792 |

---

### Wrapped Ether ([WETH.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/WETH.sol)) y Envío por Lotes ([BatchTransfer.sol](https://github.com/cjbaezilla/diplomado-usach-training-dapp-contracts/blob/main/contracts/BatchTransfer.sol))

La actividad transaccional de conversión de Ether y distribución de tokens por lotes reporta el siguiente resumen en los respectivos contratos.

#### Wrapped Ether (WETH)
*   **Operaciones de Depósito (Wrap):** `140`
*   **Operaciones de Retiro (Unwrap):** `12`

#### Envío de Tokens por Lote (BatchTransfer)
*   **Lotes Enviados:** `2`
*   **Total de Tokens Distribuidos:** `48.0`

---

## Análisis de Comportamiento del Estudiante y Adopción del Ecosistema

El volumen transaccional consolidado en la blockchain de pruebas evidencia una adopción activa y progresiva del ecosistema descentralizado por parte de la comunidad académica, el registro de veintisiete estudiantes únicos en el contrato de identidades establece la base de usuarios activos, de los cuales veinticinco han interactuado de manera recurrente con los demás componentes del sistema, la distribución de doscientas cuarenta y una insignias de reliquias refleja un avance homogéneo en los primeros desafíos, mostrando una tasa de finalización alta en las tareas introductorias de conexión de billeteras, reclamo del grifo y registro de perfil, lo cual valida la efectividad del diseño de la interfaz y la claridad de las guías integradas.

El despliegue de ciento quince tokens personalizados a través de la fábrica evidencia la curiosidad técnica y el deseo de los alumnos de explorar la creación de activos propios, no obstante, se observa una disparidad en la configuración del suministro inicial y la posterior inyección de liquidez, donde solo una fracción de los tokens creados posee mercados activos, la creación de noventa y ocho piscinas de liquidez en el DEX demuestra un esfuerzo significativo por comprender el funcionamiento de los creadores de mercado automatizados, acumulando un valor total bloqueado de más de treinta y tres unidades de Wrapped Ether que respalda las operaciones de intercambio, los pares con mayor actividad comercial son aquellos vinculados a tokens de uso común y pruebas del profesor, lo cual indica que los estudiantes priorizan la interacción con los mercados de referencia antes de experimentar con sus propios pares comerciales, este comportamiento práctico y estructurado valida la solidez pedagógica del Diplomado USACH en la formación de desarrolladores Web3 competentes.
