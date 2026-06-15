# Guía Académica Completa: Gestión de Tiempos (Time-dependent logic), SaaS On-Chain y Cobros Recurrentes en Solidity

Esta guía de estudio y análisis técnico exhaustivo tiene como propósito examinar minuciosamente el funcionamiento y la arquitectura del contrato inteligente `15_SuscripcionServicio.sol`. Sirve como herramienta pedagógica de alto rigor académico para que los estudiantes del diplomado de la Universidad de Santiago de Chile (USACH) adquieran competencias avanzadas sobre la manipulación de marcas de tiempo en la Ethereum Virtual Machine (EVM), el flujo de transferencias de valor nativo (Ether), la representación y almacenamiento de mappings de control temporal, y las estrategias de seguridad y cobro recurrente SaaS en la Web3.

El contrato de referencia que analizaremos minuciosamente a lo largo de este documento es el siguiente:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.35;

/**
 * @title SuscripcionServicio
 * @dev Combina variables de tiempo, mappings y cobro de Ether para crear un modelo de
 * negocio SaaS (Software as a Service) recurrente directamente en la blockchain.
 * Caso de negocio: Un cliente paga un precio mensual en Ether para activar su suscripción.
 * El contrato almacena cuándo expira su membresía y valida si puede acceder al servicio.
 */
contract SuscripcionServicio {
    // Dirección del propietario del servicio SaaS (para retirar las ganancias)
    address public propietarioServicio;
    
    // Costo mensual del servicio (ej. en wei)
    uint256 public costoMensual;
    
    // Duración de la membresía: 30 días (30 días * 24 horas * 60 min * 60 seg)
    uint256 public constant DURACION_MES = 30 days;

    // Mapeo: Dirección del Cliente => Timestamp de Expiración de su Suscripción
    mapping(address => uint256) public expiracionSuscripcion;

    event SuscripcionRenovada(address indexed cliente, uint256 nuevoVencimiento);
    event RetiroGanancias(address propietario, uint256 monto);

    modifier soloPropietario() {
        require(msg.sender == propietarioServicio, "Error: Solo el propietario del servicio puede realizar esta accion.");
        _;
    }

    /**
     * @dev Configura el propietario y el costo mensual de la suscripción.
     * @param _costoMensual Precio de suscripción mensual en wei.
     */
    constructor(uint256 _costoMensual) {
        propietarioServicio = msg.sender;
        costoMensual = _costoMensual;
    }

    /**
     * @notice Permite a un cliente pagar la suscripción mensual en Ether.
     * @dev Si el cliente ya tenía días activos, la nueva suscripción se suma a partir de su fecha de vencimiento actual.
     * Si ya había expirado, se inicia a partir del timestamp del bloque actual.
     */
    function pagarSuscripcion() public payable {
        require(msg.value == costoMensual, "Error: Debe enviar el monto exacto de la suscripcion mensual.");

        uint256 vencimientoActual = expiracionSuscripcion[msg.sender];
        uint256 nuevoVencimiento;

        if (block.timestamp > vencimientoActual) {
            // Si la membresía ya expiró, el nuevo mes inicia hoy
            nuevoVencimiento = block.timestamp + DURACION_MES;
        } else {
            // Si aún está activa, se acumula el mes al vencimiento que ya tenía
            nuevoVencimiento = vencimientoActual + DURACION_MES;
        }

        expiracionSuscripcion[msg.sender] = nuevoVencimiento;

        emit SuscripcionRenovada(msg.sender, nuevoVencimiento);
    }

    /**
     * @notice Permite validar si un cliente tiene acceso activo al servicio SaaS.
     * @param _cliente Dirección de la cuenta del cliente a evaluar.
     * @return true si la suscripción está activa (su fecha de vencimiento es mayor que la hora actual), false de lo contrario.
     */
    function esSuscripcionActiva(address _cliente) public view returns (bool) {
        return expiracionSuscripcion[_cliente] > block.timestamp;
    }

    /**
     * @notice Permite al propietario del servicio retirar los fondos recaudados por suscripciones.
     */
    function retirarFondosSaaS() public soloPropietario {
        uint256 balance = address(this).balance;
        require(balance > 0, "Error: No hay ganancias para retirar.");

        (bool exito, ) = propietarioServicio.call{value: balance}("");
        require(exito, "Error: El retiro fallo.");

        emit RetiroGanancias(propietarioServicio, balance);
    }

    /**
     * @notice Permite al propietario cambiar la tarifa de suscripción para nuevos pagos.
     * @param _nuevoCosto Nuevo precio en wei.
     */
    function cambiarCostoMensual(uint256 _nuevoCosto) public soloPropietario {
        costoMensual = _nuevoCosto;
    }
}
```

A través de esta guía, analizaremos cómo interactúa cada una de estas instrucciones con la pila de la EVM, examinando los opcodes de lectura y escritura física, la representación temporal de variables on-chain, y las directivas de seguridad para la gestión económica descentralizada.

---

## Capítulo 1: La Dimensión Temporal en la EVM (`block.timestamp` y Constantes de Tiempo)

El control temporal de estados en el desarrollo de contratos inteligentes difiere conceptualmente de los sistemas de cómputo tradicionales basados en relojes de CPU centralizados o servidores NTP. En la arquitectura de la Ethereum Virtual Machine (EVM), el tiempo se maneja de manera discreta bloque por bloque y está determinado por la marca de tiempo del bloque, expuesta en Solidity a través de la variable global de entorno `block.timestamp`.

### 1.1 Naturaleza Física de `block.timestamp`

La variable `block.timestamp` (que a nivel de bytecode de la EVM ejecuta la instrucción `TIMESTAMP` y consume 2 unidades de gas) representa el número de segundos transcurridos desde el Unix Epoch (1 de enero de 1970 a las 00:00:00 UTC) hasta el momento en que se mina o valida el bloque actual.

Dado que las redes blockchain operan en entornos de consenso descentralizados, el valor devuelto por `block.timestamp` no es estrictamente continuo milisegundo a milisegundo:
- **Consistencia del bloque:** Todos los contratos inteligentes ejecutados dentro de una misma transacción y en el mismo bloque leerán exactamente el mismo valor de `block.timestamp`. El tiempo se "congela" durante la conformación del bloque.
- **Validación del Consenso (Proof of Stake):** En la especificación actual de Ethereum (Post-Merge), el tiempo se divide en **slots** fijos de 12 segundos exactos. Los validadores asignados a cada slot deben proponer un bloque cuyo `timestamp` coincida con el inicio de su correspondiente slot. Esto significa que `block.timestamp` se incrementa típicamente en múltiplos de 12 segundos (o más, si un validador pierde su turno).

### 1.2 Reglas de Validación de Marcas de Tiempo en la Red

La EVM impone reglas estrictas para evitar que los validadores manipulen la marca de tiempo a su favor (un ataque conocido históricamente como *timestamp manipulation*):
1. **Monotonía estricta:** El `timestamp` de un bloque $N$ debe ser estrictamente mayor que el del bloque predecesor $N-1$:
   $$T_N > T_{N-1}$$
2. **Límite futuro:** El `timestamp` no puede estar demasiado desplazado hacia el futuro con respecto al reloj local de los nodos validadores que verifican la transacción (el límite de tolerancia en Ethereum suele ser de un máximo de 15 segundos hacia el futuro). Si un bloque viola esta restricción, es rechazado por la red.

En Solidity, se desaconseja utilizar `block.timestamp` para generar números aleatorios debido a su predictibilidad, pero es el estándar ideal y altamente seguro para el control de accesos basados en tiempo, como plazos de suscripción, periodos de carencia y bloqueos de gobernanza.

### 1.3 Sufijos y Unidades de Tiempo en Solidity

Solidity proporciona herramientas sintácticas para simplificar la lectura de periodos de tiempo en el código. Al declarar constantes temporales, el compilador traduce de forma atómica sufijos como `seconds`, `minutes`, `hours`, `days`, `weeks` y `years` a sus equivalencias numéricas en segundos:

* `1 seconds` es equivalente a la unidad básica `1`.
* `1 minutes` se compila como el entero literal `60`.
* `1 hours` se compila como `3600` (60 minutos * 60 segundos).
* `1 days` se compila como `86400` (24 horas * 3600 segundos).
* `1 weeks` se compila como `604800` (7 días * 86400 segundos).

En nuestro contrato de referencia, la constante `DURACION_MES` se define mediante la sintaxis:
```solidity
uint256 public constant DURACION_MES = 30 days;
```
Durante el proceso de compilación a bytecode, Solidity evalúa la expresión `30 days` y almacena directamente el valor constante entero literal de `2592000` (30 días * 24 horas * 60 minutos * 60 segundos) en el bytecode, evitando cualquier cálculo aritmético redundante en tiempo de ejecución.

---

## Capítulo 2: Modelo de Negocio SaaS On-Chain y Recepción/Retiro de Fondos de Ether

El modelo de suscripción de Software como Servicio (SaaS) requiere un mecanismo de recolección de pagos periódicos y una vía segura para que la tesorería de la empresa retire los ingresos acumulados.

### 2.1 El Modificador `payable` y el Flujo de Entrada de Fondos

Para que una función en Solidity pueda recibir Ether nativo como parte de su transacción, debe ser declarada explícitamente con la palabra clave `payable`. Si un usuario intenta enviar Ether al invocar una función que carece de este modificador, la EVM abortará inmediatamente la transacción y revertirá el gas consumido.

A nivel de bytecode:
- El compilador de Solidity inyecta validaciones implícitas al inicio de cada función no marcada como `payable`. Estas validaciones evalúan si `CALLVALUE` (monto en wei enviado con la llamada) es estrictamente mayor que cero. Si lo es, ejecuta una instrucción `REVERT`.
- Al declarar `pagarSuscripcion() public payable`, omitimos esta validación implícita de `CALLVALUE`, permitiendo al contrato aceptar fondos de Ether de forma nativa e incrementar su balance contable.

### 2.2 Retiro Seguro de Fondos mediante llamadas `.call` de Bajo Nivel

Cuando el propietario decide retirar las ganancias de las suscripciones mediante `retirarFondosSaaS()`, el contrato debe transferir la totalidad del balance de Ether a la wallet correspondiente.

En Solidity clásico (versiones inferiores a `0.6.0`), se solían utilizar los métodos heredados `transfer()` y `send()`. Sin embargo, en la ingeniería Web3 moderna, se desaconseja categóricamente su uso debido a las siguientes restricciones físicas:
- **Límite de Gas Rígido:** Tanto `transfer()` como `send()` reenvían exactamente 2300 unidades de gas a la dirección de destino. Esta cantidad es suficiente para emitir un evento básico en una cuenta externa (EOA), pero es del todo insuficiente si la dirección receptora es una billetera multifirma (como Gnosis Safe) o un contrato inteligente de tesorería institucional que ejecute lógica de control interna en sus funciones `receive()` o `fallback()`.
- **Efecto de Hardforks en Gas Opcodes:** Los costes de gas de la EVM pueden cambiar con actualizaciones del protocolo Ethereum (como la EIP-1884, que incrementó el coste del opcode `SLOAD`). Esto causó que contratos de producción que dependían de `transfer()` dejaran de funcionar de un día para otro al superar el límite de 2300 gas.

La solución estándar industrial es utilizar el método de bajo nivel `.call` sin restricciones de gas, pasando una estructura de valor vacía:
```solidity
(bool exito, ) = propietarioServicio.call{value: balance}("");
require(exito, "Error: El retiro fallo.");
```
- **`.call{value: balance}("")`:** Envía la totalidad de los fondos utilizando todo el gas disponible en la transacción (a menos que se defina un límite personalizado). Esto permite al contrato receptor procesar sus operaciones sin riesgo de quedarse sin gas.
- **Protección contra Reentrada:** Debido a que `.call` delega el control de gas al destinatario, el desarrollador debe implementar siempre el patrón *Checks-Effects-Interactions* o usar la biblioteca `ReentrancyGuard` si el balance se actualiza después del envío. En este contrato, la función `retirarFondosSaaS` lee `address(this).balance` y transfiere el monto, lo cual es seguro puesto que el balance del contrato pasa a cero inmediatamente después de la llamada y no hay estados internos de balance de usuario que actualizar para este retiro.

---

## Capítulo 3: Estructuras de Datos y Mappings en Storage para Control de Vencimientos

El control de los vencimientos de membresía de cada cliente se modela utilizando un diccionario asociativo de tipo `mapping(address => uint256)`.

### 3.1 Comportamiento del Mapping en el Storage de la EVM

El mapping `expiracionSuscripcion` asocia la dirección Ethereum de cada cliente con el timestamp de vencimiento de su membresía. Como se analizó en guías anteriores (ej. `05_DirectorioClientes.md`), un mapping no almacena las claves ni tiene longitud iterable.

El slot de almacenamiento para una entrada específica se calcula criptográficamente mediante:
$$\text{SlotFísico} = \text{keccak256}(\text{abi.encode}(\text{direcciónCliente}, \text{SlotDeclaración}))$$
Donde `SlotDeclaración` de `expiracionSuscripcion` es el Slot `2` (Slot 0 es `propietarioServicio`, Slot 1 es `costoMensual`).

### 3.2 Implicaciones de Gas Cálido y Frío (`SLOAD` y `SSTORE`)

Cuando invocamos `pagarSuscripcion()`, el contrato ejecuta:
```solidity
uint256 vencimientoActual = expiracionSuscripcion[msg.sender];
```
Esta lectura en storage se cobra según el estado de calor del slot:
- **Acceso en Frío:** Si es la primera vez que se consulta el vencimiento del usuario en esta transacción, la EVM cobra 2,100 unidades de gas por la lectura `SLOAD`.
- **Acceso en Cálido:** Si la dirección ya se había consultado, el coste se reduce a 100 unidades de gas.

Al actualizar el mapping con el nuevo vencimiento:
```solidity
expiracionSuscripcion[msg.sender] = nuevoVencimiento;
```
La EVM ejecuta un `SSTORE`. El coste varía significativamente según el estado previo:
* **Inicialización (De 0 a mayor que 0):** Si el cliente no tenía una suscripción previa (su vencimiento actual era cero), el coste de inicializar la celda de almacenamiento persistente es de **20,000 unidades de gas**.
* **Actualización (De mayor que 0 a otro valor mayor que 0):** Si el cliente renueva una suscripción activa o expira a un nuevo valor, el coste de sobrescribir el slot es de **5,000 unidades de gas**.

---

## Capítulo 4: Modificadores de Acceso y Gestión de Propiedad

La gobernanza de parámetros corporativos (como cambiar la tarifa mensual o retirar las ganancias acumuladas) debe restringirse de forma exclusiva al creador del servicio SaaS.

### 4.1 Semántica del Modificador `soloPropietario`

El contrato implementa la restricción mediante el modificador `soloPropietario()`:
```solidity
modifier soloPropietario() {
    require(msg.sender == propietarioServicio, "Error: Solo el propietario del servicio puede realizar esta accion.");
    _;
}
```
Cuando una función como `cambiarCostoMensual` se decora con `soloPropietario`, el compilador realiza una inyección de código. A bajo nivel, la EVM ejecuta la comparación de igualdad `EQ` entre `msg.sender` (dirección del emisor de la transacción) y `propietarioServicio` (leído de la ranura Slot 0). Si la comparación devuelve cero (falso), la EVM ejecuta un opcode `REVERT` con la firma del error, deshaciendo los cambios y deteniendo el hilo de ejecución. El operador `_;` representa la reinyección del cuerpo de la función tras pasar la validación.

---

## Capítulo 5: Desglose Línea por Línea y Análisis Crítico de `15_SuscripcionServicio.sol`

A continuación, analizaremos críticamente cada sección de código del contrato, discutiendo su impacto operativo y de negocio.

* **Línea 2 (`pragma solidity 0.8.35;`)**: Fija la versión de Solidity a la versión didáctica del proyecto. El compilador aplica las protecciones aritméticas integradas de la versión 0.8.x contra desbordamientos, lo que hace que los cálculos como `vencimientoActual + DURACION_MES` estén protegidos de forma nativa contra desbordamientos.
* **Línea 13 (`address public propietarioServicio;`)**: Almacena la dirección del creador y administrador del SaaS. Ocupa 20 bytes en el Slot 0 de storage.
* **Línea 16 (`uint256 public costoMensual;`)**: Variable que determina la tarifa en wei para renovar la suscripción. Ocupa 32 bytes en el Slot 1.
* **Línea 19 (`uint256 public constant DURACION_MES = 30 days;`)**: Variable constante de tiempo compilada como el literal `2592000` (segundos). Al ser constante, no consume espacio de storage en el contrato; su valor se inyecta directamente en las instrucciones del bytecode que hacen referencia a ella.
* **Línea 22 (`mapping(address => uint256) public expiracionSuscripcion;`)**: Declaración del mapping para el control de vencimientos temporales.
* **Líneas 24 y 25 (`event ...`)**: Definición de los eventos de la bitácora externa del contrato. Emitir eventos con `emit` genera entradas en los logs de la EVM (opcodes `LOG1` a `LOG4`), lo que consume significativamente menos gas que escribir variables de estado en storage, y permite a las dApps en Next.js reaccionar a eventos en tiempo real.
* **Líneas 46 a 63 (`function pagarSuscripcion() public payable`)**: Esta es la función central de interacción para los clientes.
  * **Línea 47 (`require(msg.value == costoMensual, ...)`)**: Garantiza la exactitud matemática del cobro. Si el usuario envía menos (o más) Ether de lo estipulado, la transacción se revierte, impidiendo desbalances.
  * **Líneas 52 a 58 (`if (block.timestamp > vencimientoActual) { ... }`)**: Lógica de negocio de acumulación temporal.
    * Si la suscripción actual del cliente ya expiró, el nuevo mes se calcula a partir de la marca de tiempo actual (`block.timestamp + DURACION_MES`). Esto es fundamental para evitar cobrarle al usuario de manera retroactiva por el tiempo que su servicio estuvo inactivo.
    * Si la suscripción aún está vigente, el mes se acumula a partir del vencimiento existente (`vencimientoActual + DURACION_MES`). Esto incentiva al cliente a renovar con anticipación, puesto que no pierde ningún día de su saldo acumulado.
* **Línea 70 a 72 (`function esSuscripcionActiva(...) public view returns (bool)`)**: Función getter utilitaria de solo lectura. Permite a las interfaces del cliente y APIs de backend comprobar si un usuario tiene acceso al software SaaS en tiempo real de forma gratuita.

---

## Referencias Técnicas Oficiales

Para profundizar en el diseño de arquitecturas basadas en el tiempo y la transferencia de valor en Solidity, se recomienda revisar las siguientes secciones de la documentación oficial:

1. [Tipos de Unidades de Tiempo en Solidity](https://github.com/argotorg/solidity/tree/develop/docs/units-and-global-variables.html#time-units)
2. [Variables Globales y de Entorno de la EVM](https://github.com/argotorg/solidity/tree/develop/docs/units-and-global-variables.html#special-variables-and-functions)
3. [Transferencia de Ether Nativo con Call](https://github.com/argotorg/solidity/tree/develop/docs/control-structures.html#external-function-calls)
4. [Estructura de Mappings y Disposición en Storage](https://github.com/argotorg/solidity/tree/develop/docs/internals/layout_in_storage.html#mappings-and-dynamic-arrays)
5. [Seguridad contra Ataques de Manipulación Temporal](https://github.com/argotorg/solidity/tree/develop/docs/security-considerations.html#timestamp-dependence)
