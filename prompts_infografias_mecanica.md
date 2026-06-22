# Prompts para la Generación de Infografías Técnicas y Pedagógicas del Diplomado USACH

Este documento contiene una lista estructurada de instrucciones detalladas para la creación de infografías técnicas y planos conceptuales que complementan el ensayo académico sobre la dApp de entrenamiento del Diplomado de la Universidad de Santiago de Chile, sirviendo como material didáctico para ilustrar la mecánica de contratos y los flujos de interacción de los estudiantes.

## Directrices de Diseño Comunes (Esquema Blueprint)

Para garantizar la consistencia visual y la uniformidad de todo el material gráfico generado, cada prompt incorpora las siguientes especificaciones estructurales y estéticas:
*   **Estilo Visual Principal:** Plano técnico de ingeniería de software con estética de bosquejo técnico, el fondo general es de color blanco con una cuadrícula de fondo estructurada en líneas finas de color azul Ethereum, todos los elementos de contraste, bordes de los bloques, flechas de flujo y textos descriptivos emplean diferentes tonalidades del color azul institucional de Ethereum, evitando el uso de colores diversos para mantener la coherencia con un plano de mesa de diseño clásico.
*   **Relación de Aspecto:** Optimizado para pantallas panorámicas en formato de dieciséis novenos.
*   **Diseño de la Cabecera:** En la esquina superior izquierda se alinea el título principal de la infografía en tipografía sans-serif limpia y en negrita de tamaño destacado, justo debajo se despliega un subtítulo autoexplicativo que introduce brevemente el concepto pedagógico a los alumnos, en la esquina superior derecha se ubica el logotipo oficial de Ethereum en un tamaño mediano de forma simétrica a la cabecera.
*   **Diseño del Pie de Página:** Centrado en la parte inferior de la imagen se ubica una línea de separación azul fina y debajo se despliega el texto de autoría obligatoria de forma nítida, conteniendo la información de contacto de Carlos Baeza Negroni, hola@cbaeza.com, https://cbaeza.com y el teléfono de contacto.

---

## Detalle de Prompts para Infografías Técnicas

### 1. Portada y Arquitectura Híbrida del Sistema (Placeholder 1)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "USACH - dApp de Entrenamiento Web3" y debajo el subtítulo "Arquitectura Híbrida y Flujos de Comunicación Descentralizados", el logotipo de Ethereum se ubica en la esquina superior derecha en una posición fija.

El cuerpo principal del plano ilustra la división del sistema en tres capas verticales bien diferenciadas, la primera sección a la izquierda representa la capa del Cliente (Frontend Next.js) con bloques dedicados a la billetera Web3 (MetaMask/RainbowKit) y los hooks reactivos de Wagmi, la segunda sección central representa la capa del Servidor (API Backend local de validación) que interactúa directamente con el indexador de transacciones, la tercera sección a la derecha representa la Capa de Consenso (Blockchain EVM Sepolia) mostrando el nodo RPC y los contratos inteligentes principales distribuidos en bloques de almacenamiento.

Dibuja flechas de flujo azules que conectan de forma secuencial la capa del cliente enviando la solicitud HTTP hacia la API de validación, la API consultando el estado al nodo RPC, el servidor emitiendo la firma criptográfica de regreso al cliente, y el cliente interactuando finalmente con la blockchain mediante una transacción de acuñación directa, añade notas técnicas pedagógicas aclaratorias en las esquinas inferiores explicando el ciclo de vida del dato.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 2. Flujo de Intercambio (Swap) y Conservación de Reservas en DEXPool (Placeholder 2)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "DEXPool - Mecánica del Intercambio (Swap)" y debajo el subtítulo "Creador de Mercado Automatizado (AMM) y Modelo de Reservas del Par", el logotipo de Ethereum se ubica en la esquina superior derecha.

El diagrama central ilustra el interior del contrato inteligente DEXPool como un gran contenedor de almacenamiento que resguarda dos compartimentos correspondientes a las reservas de Token0 y Token1, a la izquierda del pool se dibuja el flujo del Token de Entrada ingresando al contrato tras deducirse la comisión fija del tres por mil, en el centro se representa conceptualmente la regla de conservación del producto que obliga a mantener la equivalencia de multiplicación de las reservas de ambos activos para determinar el balance final de salida, a la derecha del pool se dibuja el flujo del Token de Salida egresando hacia el usuario.

Añade flechas de dirección que explican cómo el depósito del token de entrada incrementa las reservas de su respectivo compartimento y reduce las reservas del compartimento del token de salida, incorporando descripciones textuales sobre la actualización inmutable de los balances internos de almacenamiento tras completarse el swap.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 3. Proceso de Firma Digital ECDSA y Verificación Off-Chain (Placeholder 3)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Criptografía ECDSA en ChallengeMinter" y debajo el subtítulo "Flujo de Validación Híbrido, Generación de Firmas y Prevención de Ataques de Repetición", el logotipo de Ethereum se ubica en la esquina superior derecha.

El cuerpo principal muestra a la izquierda el Servidor de Validación que contiene la clave privada del firmante autorizado y genera el hash del mensaje combinando la dirección del usuario, el identificador de desafío, un valor único de un solo uso y la dirección de destino del contrato validador, en el centro se detalla la firma resultante compuesta por los parámetros R, S y V representados en bloques de bytes, a la derecha se ilustra el contrato ChallengeMinter en la EVM recibiendo los parámetros y utilizando la operación de recuperación de clave pública para confrontarla contra las direcciones del rol de firmantes autorizados.

Dibuja un bloque secundario dentro del contrato que ilustra el mapeo de firmas consumidas donde se registra el hash del mensaje para inhabilitar reclamos duplicados del mismo desafío, añadiendo flechas direccionales azules que explican el camino del dato desde la firma off-chain hasta la validación de la transacción on-chain.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 4. Formulario de Identidad en StudentIdentity.sol (Placeholder 4)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "StudentIdentity - Registro de Perfil Académico" y debajo el subtítulo "Vinculación de Billeteras Web3 con Metadatos Estudiantiles On-Chain", el logotipo de Ethereum se ubica en la esquina superior derecha.

La sección izquierda del diagrama modela la pantalla de la interfaz de usuario con los campos de entrada de texto estructurados correspondientes al nombre completo, el correo institucional con dominio certificado, el perfil profesional de LinkedIn y el avatar digital, la sección derecha muestra el mapeo de almacenamiento de la EVM estructurado en celdas de memoria consecutivas donde se guardan los perfiles de estudiantes asociados a su dirección Ethereum, representando el flujo del envío de la transacción mediante una flecha azul gruesa de izquierda a derecha.

Muestra de forma pedagógica la verificación que ejecuta el contrato inteligente para requerir que el campo del nombre posea una longitud de caracteres mayor a cero antes de reservar los espacios de almacenamiento para el perfil.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 5. Creación de Tokens y Panel de Gestión de ERC-20 (Placeholder 5)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Fábrica de Tokens y Control de Suministro" y debajo el subtítulo "Despliegue Dinámico de Contratos BaseERC20 y Consulta de Saldos Activos", el logotipo de Ethereum se ubica en la esquina superior derecha.

El diseño se estructura en dos paneles principales, el panel superior ilustra la interacción con la fábrica de tokens donde el creador ingresa el nombre, símbolo y suministro inicial y la fábrica utiliza el código de creación para instanciar un nuevo contrato inteligente con dirección propia en la blockchain, el panel inferior modela la interfaz de gestión donde se detallan los balances de la billetera conectada, el botón de acuñación adicional exclusivo para el propietario y el historial de eventos de transferencia que audita los movimientos en tiempo real.

Dibuja flechas que muestran la emisión de eventos de creación y transferencia desde la red hacia la interfaz para ilustrar la actualización de la lista de activos creados por los estudiantes.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 6. Calculadora de Precios y Tasa de Conversión del AMM (Placeholder 6)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Calculadora de Precios AMM" y debajo el subtítulo "Modelo de Tasa de Conversión y Desplazamiento de Reservas Bajo la Regla de Producto Constante", el logotipo de Ethereum se ubica en la esquina superior derecha.

El plano muestra un gráfico técnico de cuadrícula que representa la curva hiperbólica de precios de los dos tokens en el pool de liquidez, un bloque lateral describe el comportamiento de la calculadora de la interfaz donde el usuario ingresa el monto de entrada y el sistema computa de forma automática la cantidad exacta de salida basándose en la relación actual de las reservas internas y aplicando la comisión, ilustrando cómo el precio relativo cambia en función de la magnitud de la transacción con respecto al tamaño total de la piscina.

Incluye anotaciones pedagógicas que explican el concepto de deslizamiento de precios (slippage) cuando se ejecutan grandes órdenes que alteran de forma sustancial la proporción de reservas.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 7. Inyección de Liquidez Simétrica y Emisión de LP Tokens (Placeholder 7)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Aporte de Liquidez y Emisión de LP Tokens" y debajo el subtítulo "Cálculo de Proporción Simétrica de Depósito y Distribución de Acciones en DEXPool", el logotipo de Ethereum se ubica en la esquina superior derecha.

El plano detalla a la izquierda al Proveedor de Liquidez ingresando montos de dos tokens diferentes a la piscina, el centro detalla el cálculo del contrato inteligente que evalúa si el pool está vacío para emitir tokens de participación iniciales calculando la raíz cuadrada del producto depositado, o si el pool ya posee liquidez obligando al usuario a respetar la proporción actual de las reservas existentes, a la derecha se ilustra la piscina recibiendo los tokens y el posterior acuñamiento de tokens LP de participación que se transfieren de regreso a la dirección del proveedor de liquidez.

Añade notas aclaratorias sobre el proceso de retiro de liquidez que quema los tokens LP y devuelve la parte proporcional de las reservas acumuladas en la piscina.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 8. Senda de Desafíos Académicos y Reclamo de NFTs (Placeholder 8)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Senda de Desafíos Académicos y Reclamo de Reliquias" y debajo el subtítulo "Ciclo de Certificación Académica Mediante la Acuñación de Insignias NFT ERC-1155", el logotipo de Ethereum se ubica en la esquina superior derecha.

El diseño representa un camino secuencial que conecta las diez etapas académicas del diplomado comenzando por la configuración de la billetera y el grifo de tokens y avanzando hacia la creación de tokens y la provisión de liquidez en el DEX, cada hito muestra una reliquia inmutable identificada por su respectivo número de ID del cero al nueve, flechas de flujo detallan la validación on-chain mediante llamadas de lectura del servidor de la dApp y el posterior modal de firma de transacciones que acuña la insignia NFT directamente en la cuenta del estudiante.

Muestra de manera destacada las cantidades totales acuñadas para cada una de las diez insignias reportadas por la blockchain para relacionar los datos de las métricas con el progreso.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 9. Distribución de Almacenamiento (Storage Layout) y Slots en el DEX (Placeholder 9 - Adicional)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Storage Layout del DEXPool - Estructura de Slots" y debajo el subtítulo "Organización de Variables en Memoria de Almacenamiento Persistente de la EVM", el logotipo de Ethereum se ubica en la esquina superior derecha.

El diagrama central representa la estructura física de la memoria de almacenamiento persistente del contrato DEXPool organizada en filas consecutivas de treinta y dos bytes cada una correspondiente a los slots de almacenamiento, el slot cero muestra la variable heredada del propietario si aplica o el balance inicial, el slot uno muestra la dirección inmutable del Token0, el slot dos muestra la dirección inmutable del Token1, el slot tres muestra la variable de reserva de almacenamiento del Token0 empaquetada junto con la reserva del Token1 si su tamaño de bits lo permite o en slots separados consecutivos indicando el índice de slot correspondiente.

Añade diagramas explicativos que enseñan cómo la lectura de variables de almacenamiento optimiza el gas de la transacción al consolidar variables relacionadas en accesos de memoria agrupados de un solo slot.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 10. Mecanismo de Envoltura (Wrap) y Paridad 1:1 de WETH (Placeholder 10 - Adicional)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Mecanismo de Envoltura de WETH" y debajo el subtítulo "Conversión de Ether Nativo a ERC-20 Bajo Paridad Uno a Uno en la EVM", el logotipo de Ethereum se ubica en la esquina superior derecha.

El plano representa a la izquierda al usuario enviando Ether nativo al contrato de envoltura WETH, el centro ilustra al contrato inteligente WETH como una bóveda de almacenamiento seguro que retiene los fondos en Ether nativo en su balance general, a la derecha se detalla la acuñación inmediata de la misma cantidad de tokens Wrapped Ether ERC-20 que se envían al balance de la billetera del usuario, el flujo inferior muestra el proceso de retiro donde el usuario transfiere los tokens WETH de regreso al contrato el cual los quema y libera el Ether nativo acumulado en su balance.

Añade flechas bidireccionales que ilustran la equivalencia estricta de precios donde un token WETH siempre equivale exactamente a una unidad de Ether nativo.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 11. Estructura de Roles y AccessControl en ChallengeMinter (Placeholder 11 - Adicional)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "AccessControl en ChallengeMinter" y debajo el subtítulo "Estructura Jerárquica de Permisos y Roles de Firmantes Autorizados", el logotipo de Ethereum se ubica en la esquina superior derecha.

El cuerpo principal muestra una estructura jerárquica de permisos de administración del contrato, el bloque superior representa el rol de Administrador por Defecto asignado al desplegarse el contrato el cual posee facultades exclusivas para asignar o remover roles de acceso, el bloque inferior de primer nivel representa el Rol de Firmante Autorizado (SIGNER_ROLE) asignado a la dirección pública del servidor del backend local, un flujo direccional muestra cómo el firmante autorizado emite las firmas criptográficas de los desafíos de los estudiantes y el contrato ChallengeMinter verifica inmutablemente que la dirección recuperada de la firma posea el rol de firmante registrado.

Detalla la restricción de que solo las direcciones que cuenten con el rol de firmante registrado pueden instruir al contrato de insignias la acuñación de nuevos tokens académicos.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```

---

### 12. Optimización de Gas y Procesamiento por Lotes en BatchTransfer (Placeholder 12 - Adicional)

**Prompt para Generación Gráfica:**
```text
Crea un plano técnico con estilo de bosquejo técnico en formato panorámico dieciséis novenos, el fondo es blanco con una cuadrícula de líneas finas de color azul Ethereum y todos los elementos gráficos emplean variaciones del color azul, la cabecera en la esquina superior izquierda muestra el título principal "Optimización de Gas y Procesamiento por Lotes" y debajo el subtítulo "Análisis del Consumo de Gas en Transferencias Individuales vs BatchTransfer", el logotipo de Ethereum se ubica en la esquina superior derecha.

El plano se divide en dos secciones comparativas de consumo de gas en transacciones, la sección superior ilustra el flujo tradicional donde un emisor realiza múltiples transferencias individuales independientes a diferentes destinatarios pagando el costo de inicialización de la transacción en cada una de ellas, la sección inferior ilustra el flujo optimizado utilizando el contrato BatchTransfer donde el emisor envía un arreglo de destinatarios y un arreglo de montos en una sola transacción consolidada que procesa internamente la distribución.

Añade descripciones pedagógicas que explican cómo el uso de bucles de iteración interna en memoria reduce los costos de gas fijos al consolidar los gastos operativos en una única transacción de la red.

En la parte inferior de la imagen, tras una línea azul fina, despliega centrado el texto "Carlos Baeza Negroni | hola@cbaeza.com | https://cbaeza.com | +56985644026" como pie de página uniforme.
```
