# Guía Académica y Prompts Técnicos para Infografías de DEX y AMM

Este documento identifica los fundamentos académicos clave que un estudiante de Finanzas Descentralizadas (DeFi) e Ingeniería de Contratos Inteligentes debe comprender para asimilar la lógica de nuestro DEX educativo. Asimismo, proporciona una lista de prompts altamente descriptivos y detallados técnicamente para la creación de infografías complementarias que apoyen visualmente cada tema.

---

## 🎓 Fundamentos Académicos Clave para el Estudiante

Para comprender la lógica de los contratos inteligentes `DEXPool` y `DEXFactory`, el estudiante debe dominar los siguientes conceptos transversales de economía de redes y criptografía aplicada:

1.  **Microeconomía Financiera (Mecanismos de Mercado)**: La transición del emparejamiento discreto y asíncrono de un libro de órdenes centralizado al emparejamiento continuo y determinista de reservas de tokens (AMM).
2.  **Álgebra de Curvas y Geometría Analítica**: Comprender las propiedades de la función hiperbólica $x \cdot y = k$, las asíntotas y la tasa marginal de sustitución dada por el ratio instantáneo de las reservas.
3.  **Matemáticas de Proporcionalidad (Aritmética Escalar)**: El uso de la media geométrica para la valoración simétrica inicial y el cálculo de razones y proporciones para aportaciones y retiros equitativos.
4.  **Dinámica de Arbitraje y Teoría de Juegos**: Cómo los incentivos económicos mueven a agentes externos a equilibrar el precio del pool respecto al mercado mundial, asumiendo costos de transacción y deslizamiento.
5.  **Seguridad Informática y Aritmética de Máquina (EVM)**: Las implicaciones del almacenamiento de números enteros sin coma decimal, redondeos matemáticos sesgados a favor del protocolo y la prevención de ataques de reentrada mediante estados atómicos y de exclusión mutua.

---

## 📊 Prompts Técnicos para Infografías Didácticas

A continuación se listan cinco propuestas de infografías fundamentales con sus respectivos prompts descriptivos. Estos prompts detallan la disposición espacial del contenido, las fórmulas matemáticas, los diagramas lógicos y las etiquetas necesarias, omitiendo por completo directrices de color.

---

### Prompt 1: Comparación del Descubrimiento de Precios: Libros de Órdenes vs. AMM

**Descripción del Tema**: Ilustración pedagógica de la transición de la liquidez basada en intenciones de trading a la liquidez de reserva algorítmica.

**Prompt Técnico para el Diseñador Visual**:
Este diagrama debe estar estructurado en dos paneles principales dispuestos lado a lado para establecer un contraste directo y claro de los flujos lógicos de mercado. 

El **Panel Izquierdo** ilustrará el sistema tradicional de **Libro de Órdenes (Order Book)**. En la parte superior de este panel se ubicará una tabla jerárquica titulada "Órdenes de Venta (Asks)", con filas que muestren precios descendentes y volúmenes de tokens en venta. Justo debajo, debe quedar un espacio central etiquetado como "Spread de Mercado" (la brecha de precio entre la oferta de venta más baja y la de compra más alta). Debajo del spread, se ubicará la tabla de "Órdenes de Compra (Bids)", con filas de precios descendentes y cantidades correspondientes. A la izquierda del panel, se debe dibujar un flujo de entrada que represente a "Creadores de Mercado (Market Makers)" inyectando y cancelando órdenes de compra/venta limitadas de forma asíncrona hacia el libro. A la derecha, un flujo representará a un "Trader de Mercado" que envía una orden de compra directa que se empareja de forma discreta con la orden de venta más baja disponible en la tabla.

El **Panel Derecho** ilustrará el sistema de **Creador de Mercado Automatizado (AMM - Liquidity Pool)**. El elemento central debe ser un contenedor circular que simule una "piscina de liquidez" dividido verticalmente en dos secciones iguales y claramente delimitadas. La sección izquierda se etiquetará como "Reserva del Token A (x)" y la derecha como "Reserva del Token B (y)". En el centro de la piscina, se colocará una ecuación matemática grande e independiente que dicte: "Fórmula de Producto Constante: x * y = k". Debajo de la piscina, se debe ilustrar un bloque titulado "Contrato Inteligente (DEXPool)" que conecte las dos reservas mediante un conducto regulador. En la parte exterior izquierda de la piscina, se dibujará una figura titulada "Proveedor de Liquidez" enviando flechas paralelas que depositan simultáneamente Token A y Token B en la piscina a cambio de una flecha de salida que le entrega un ticket etiquetado como "Acción de Liquidez (LP Token)". En la parte exterior derecha de la piscina, se dibujará una figura titulada "Trader de Swap" que introduce una única flecha de "Token A (Entrada)" hacia la piscina y extrae una única flecha de "Token B (Salida)".

Entre ambos paneles, en la parte inferior de la infografía, debe colocarse una tabla comparativa con tres filas de texto:
- Fila 1: "Descubrimiento de precios: Basado en emparejamiento manual de ofertas vs. Basado en fórmula matemática algorítmica de reservas".
- Fila 2: "Rol del Proveedor: Creador activo que coloca órdenes límite vs. Proveedor pasivo que aporta activos a un pool común".
- Fila 3: "Ejecución: Asíncrona (depende de encontrar contraparte) vs. Síncrona e inmediata contra el contrato inteligente".

---

### Prompt 2: La Dinámica de la Curva Hiperbólica y el Deslizamiento (Slippage)

**Descripción del Tema**: Análisis geométrico de la fórmula $x \cdot y = k$, la variación de precios marginales y el deslizamiento de precios en swaps reales.

**Prompt Técnico para el Diseñador Visual**:
Esta infografía se organizará en torno a un gráfico matemático cartesiano bidimensional que ocupe las dos terceras partes superiores del plano visual. El eje horizontal (X) estará etiquetado como "Reserva del Token A (x)" y el eje vertical (Y) como "Reserva del Token B (y)". 

Sobre el plano del gráfico se dibujará una curva hiperbólica convexa decreciente muy suave que represente la ecuación "$x * y = k$". Sobre esta curva se marcarán claramente tres puntos y sus proyecciones hacia los ejes:
1.  Un punto inicial denominado "Punto A (Estado Original del Pool)" con coordenadas proyectadas en líneas punteadas hacia el eje X ($x_0$) y hacia el eje Y ($y_0$).
2.  Un punto intermedio titulado "Punto B (Estado del Pool post-Swap)" ubicado más a la derecha sobre la curva. La distancia horizontal entre $x_0$ y el nuevo punto en el eje X ($x_1$) se delimitará con una flecha gruesa y horizontal titulada "Delta x (Tokens A depositados por el Trader)". La distancia vertical entre $y_0$ y el nuevo punto en el eje Y ($y_1$) se marcará con una flecha vertical apuntando hacia abajo titulada "Delta y (Tokens B entregados al Trader)".
3.  Una recta tangente a la curva en el "Punto A". Esta recta debe etiquetarse como "Precio Marginal Spot Teórico (dy/dx = P_spot)".
4.  Una recta secante que pase directamente por el "Punto A" y el "Punto B". Esta recta debe etiquetarse como "Precio de Ejecución Efectivo de la Orden (Delta y / Delta x = P_efectivo)". Debe apreciarse visualmente que la pendiente de la recta secante es diferente a la de la tangente, ilustrando el "Impacto de Precio".

En el tercio inferior de la infografía, se debe incluir un diagrama secuencial titulado "Mecánica del Deslizamiento (Slippage)". Este mostrará tres bloques horizontales que representen una transacción en tres instantes de tiempo:
- Bloque 1: "Envío de la orden de Swap". El trader ve el precio teórico spot en la interfaz y establece un límite de tolerancia (por ejemplo, 0.5%).
- Bloque 2: "Transacciones previas en tránsito". Se muestra un bloque intermedio de red donde otra transacción de gran volumen se procesa primero en el bloque, empujando el pool de reservas a un nuevo punto de precio sobre la curva hiperbólica de forma involuntaria.
- Bloque 3: "Ejecución de la orden". Se ilustra una bifurcación lógica: si el nuevo precio de ejecución efectivo se desvía más allá del 0.5% definido, el contrato inteligente aborta la operación emitiendo la orden de cancelación (revert); si la desviación está dentro del límite, la transacción se ejecuta cobrando el impacto acumulado.

---

### Prompt 3: Ciclo de Vida de Provisión de Liquidez y Acuñación de LP Tokens

**Descripción del Tema**: Explicación visual del cálculo de LP Tokens para depósitos iniciales y depósitos de mantenimiento de proporción.

**Prompt Técnico para el Diseñador Visual**:
Esta infografía debe presentar un flujo de proceso dividido en tres secciones verticales numeradas consecutivamente, ordenadas de izquierda a derecha.

La **Sección 1 (Piscina Vacía - Depósito Inicial)** mostrará un bloque de inicio que represente una piscina sin activos. Se dibujará una balanza con dos platillos vacíos que representan "Token A" y "Token B". Una figura de proveedor deposita cantidades asimétricas de tokens (por ejemplo, 100 de Token A y 400 de Token B). Una caja de proceso matemático al lado de la balanza debe mostrar de forma muy clara la ecuación del cálculo: 
$$\text{LP Emitidos} = \text{sqrt}(100 \cdot 400) = \text{sqrt}(40000) = 200 \text{ LP Tokens}$$
Se debe graficar la emisión de un certificado que represente esos "200 LP Tokens" dirigiéndose al proveedor.

La **Sección 2 (Piscina Activa - Depósitos Subsecuentes)** ilustrará la piscina ya inicializada con reservas internas ($x = 100, y = 400$) y un suministro total de LP de 200. Se dibujará un segundo proveedor que desea inyectar más liquidez. El diagrama debe mostrar un cálculo restrictivo: el proveedor ingresa 50 de Token A. El contrato inteligente ejecuta una regla de tres simple para determinar la cantidad exacta requerida del segundo token para no distorsionar la paridad:
$$\text{Token B Óptimo} = \frac{50 \cdot 400}{100} = 200 \text{ Token B}$$
Se representará visualmente que si el proveedor intentó enviar 250 de Token B, el contrato solo extrae 200, dejando los 50 restantes en la billetera del usuario. Se mostrará la caja de cálculo del LP emitido basado en la menor de las proporciones:
$$\text{LP a emitir} = \min\left( \frac{50 \cdot 200}{100}, \frac{200 \cdot 200}{400} \right) = \min(100, 100) = 100 \text{ LP Tokens}$$

La **Sección 3 (Remoción de Liquidez e Intereses por Comisiones)** ilustrará el proceso inverso de salida. Se mostrará una piscina con reservas incrementadas gracias al volumen comercial de swaps acumulados (por ejemplo, reservas actuales: $x = 180, y = 720$, suministro total de LP = 300). El primer proveedor devuelve sus 200 LP Tokens (que representan el 66.6% del pool). El contrato procesa el cálculo:
$$\text{Retorno Token A} = \frac{200 \cdot 180}{300} = 120 \text{ Token A}$$
$$\text{Retorno Token B} = \frac{200 \cdot 720}{300} = 480 \text{ Token B}$$
Se debe contrastar mediante un gráfico de comparación de barras que el proveedor depositó inicialmente 100 Token A y 400 Token B, y al final retira 120 Token A y 480 Token B, demostrando el cobro neto de comisiones acumuladas.

---

### Prompt 4: Pérdida Impermanente y Arbitraje entre Mercados

**Descripción del Tema**: Análisis del riesgo de pérdida por divergencia de precio externo y la nivelación del precio de la piscina por traders de arbitraje.

**Prompt Técnico para el Diseñador Visual**:
Esta infografía se organizará en tres niveles horizontales superpuestos para ilustrar de forma temporal el flujo lógico de la pérdida impermanente y su balance dinámico.

El **Nivel Superior (Estado de Equilibrio)** ilustrará dos paneles en paralelo. El panel izquierdo representará la "Piscina de Liquidez DEX" con reservas equilibradas ($x = 10, y = 10$, precio interno del Token A = 1 Token B). El panel derecho representará un "Exchange Externo (Mercado Centralizado)" donde el precio de cotización del Token A es exactamente el mismo (1 Token B). Un proveedor de liquidez observa satisfecho el equilibrio de sus activos valorados en 20 tokens en total.

El **Nivel Medio (Desviación Externa y Arbitraje)** representará un cambio drástico: el precio de cotización externa de Token A en el panel derecho se duplica repentinamente a 2 Token B debido a noticias externas. En este momento, se ilustrará la figura de un "Trader de Arbitraje" que observa la brecha de precios. Se dibujará una flecha de acción cíclica: el arbitrajista acude a la piscina DEX (donde Token A se ofrece a precio rezagado de 1 Token B), compra el Token A barato inyectando Token B, y lo vende de forma inmediata en el mercado externo por 2 Token B, obteniendo una ganancia neta. Este flujo se repetirá visualmente hasta que las reservas del pool DEX cambien y alcancen el nuevo precio interno de equilibrio de 2 Token B. Se mostrará el estado final de las reservas de la piscina calculadas bajo la fórmula de arbitraje:
$$x_{\text{final}} = \sqrt{\frac{100}{2}} \approx 7.07 \quad y_{\text{final}} = \sqrt{100 \cdot 2} \approx 14.14$$

El **Nivel Inferior (Evaluación de Pérdida Impermanente)** comparará los resultados finales del portafolio del proveedor de liquidez. Se dibujarán dos portafolios en paralelo:
- Portafolio HODL (Mantener fuera del pool): El usuario tendría 10 Token A y 10 Token B. Valorados en el nuevo precio del mercado externo (1 Token A = 2 Token B), el portafolio HODL equivale a:
  $$V_{\text{HODL}} = 10 \cdot 2 + 10 = 30 \text{ Token B}$$
- Portafolio Pool (Retirar de la piscina): El usuario recupera las nuevas reservas del pool ($7.07$ Token A y $14.14$ Token B). Valorados en el nuevo precio, equivale a:
  $$V_{\text{Pool}} = 7.07 \cdot 2 + 14.14 = 28.28 \text{ Token B}$$

Se calculará la pérdida impermanente neta en un recuadro destacado:
$$\text{IL} = \frac{28.28}{30.00} - 1 = -5.73\%$$
Al lado de este recuadro, se colocará un gráfico de línea continuo que muestre la curva de pérdida impermanente en función de la variación de precios externos (eje horizontal de variación $r$, eje vertical de pérdida porcentual), marcando con un punto destacado la pérdida del 5.73% para un cambio de precio de $r = 2$.

---

### Prompt 5: Anatomía de un Bloqueo de Reentrada en Smart Contracts (Seguridad)

**Descripción del Tema**: Análisis a bajo nivel de la vulnerabilidad de reentrada y la lógica de exclusión mutua (`ReentrancyGuard`) mediante un interruptor de estado (mutex).

**Prompt Técnico para el Diseñador Visual**:
Esta infografía se estructurará verticalmente para contrastar de manera directa un flujo de ejecución vulnerable frente a uno protegido en Solidity.

La **Mitad Izquierda (Flujo Vulnerable de Reentrada)** mostrará un diagrama secuencial que ilustre el flujo de una transacción maliciosa atacando una piscina de liquidez mal diseñada. 
- Paso 1: El contrato del atacante invoca `removerLiquidez`.
- Paso 2: El pool vulnerable calcula los tokens a devolver y, antes de modificar su saldo interno de reservas, realiza la llamada externa enviando los tokens ERC20 al atacante (`Interaction`).
- Paso 3: Al recibir la llamada de transferencia, el contrato del atacante ejecuta código malicioso dentro de su función `fallback` (representada por un símbolo de bucle que redirige de vuelta al pool) invocando nuevamente a `removerLiquidez` de forma recursiva.
- Paso 4: El pool procesa la segunda llamada. Como sus variables de reserva interna no se han actualizado aún, vuelve a calcular la misma cantidad de tokens devueltos, drenando los fondos del pool de forma ilícita.

La **Mitad Derecha (Flujo Protegido con Mutex y nonReentrant)** ilustrará cómo opera el modificador `nonReentrant` de OpenZeppelin. El elemento visual clave será un "Interruptor de Seguridad Lógico" o candado físico de estado que tenga dos posiciones marcadas:
- Posición 1: `_NOT_ENTERED` (Desbloqueado / Estado Inicial).
- Posición 2: `_ENTERED` (Bloqueado / Transacción en Proceso).

Se trazará el flujo secuencial de la transacción bajo el modificador `nonReentrant`:
- Paso 1: El usuario llama a `removerLiquidez`.
- Paso 2 (Verificación de Guardia): El contrato verifica que el interruptor esté en `_NOT_ENTERED`. Al ser correcto, cambia de inmediato el estado del interruptor a `_ENTERED` (Mutex Bloqueado).
- Paso 3 (Ejecución): El pool ejecuta la función de forma segura. Si el atacante intenta reentrar recursivamente desde su fallback en este paso, el contrato del pool evaluará el interruptor, verá que se encuentra en estado `_ENTERED`, y rechazará de inmediato la transacción con un error revert.
- Paso 4 (Restablecimiento del Candado): Una vez terminada la ejecución limpia de la función, el contrato cambia el interruptor de vuelta a `_NOT_ENTERED` de forma automática, dejándolo disponible para futuras transacciones legítimas.
- Paso 5 (Patrón Checks-Effects-Interactions): Mostrar un recuadro destacado que ilustre la regla de ordenación de Solidity:
  1. Validar requerimientos (`Checks`).
  2. Actualizar variables de reserva y de LP token en disco (`Effects`).
  3. Transferir activos reales hacia el exterior (`Interactions`).
