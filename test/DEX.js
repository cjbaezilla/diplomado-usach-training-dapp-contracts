const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contratos DEX (Factory y Pool)", function () {
  let BaseERC20;
  let DEXFactory;
  let DEXPool;

  let tokenA;
  let tokenB;
  let factory;
  let pool;

  let owner;
  let proveedor1;
  let proveedor2;
  let trader;

  beforeEach(async function () {
    // Obtener las cuentas firmantes (signers)
    [owner, proveedor1, proveedor2, trader] = await ethers.getSigners();

    // Obtener las fábricas de contratos
    BaseERC20 = await ethers.getContractFactory("BaseERC20");
    DEXFactory = await ethers.getContractFactory("DEXFactory");
    DEXPool = await ethers.getContractFactory("DEXPool");

    // Desplegar tokens ERC20 de prueba
    tokenA = await BaseERC20.deploy("Token A", "TKA", owner.address);
    tokenB = await BaseERC20.deploy("Token B", "TKB", owner.address);

    // Desplegar la fábrica del DEX
    factory = await DEXFactory.deploy();

    // Acuñar tokens a las cuentas de prueba para las interacciones
    const cantidadInicial = ethers.parseEther("10000"); // 10,000 tokens
    await tokenA.mint(proveedor1.address, cantidadInicial);
    await tokenB.mint(proveedor1.address, cantidadInicial);
    await tokenA.mint(proveedor2.address, cantidadInicial);
    await tokenB.mint(proveedor2.address, cantidadInicial);
    await tokenA.mint(trader.address, cantidadInicial);
    await tokenB.mint(trader.address, cantidadInicial);

    // Crear la piscina de liquidez (Pool) a través de la fábrica
    const tx = await factory.crearPool(tokenA.target, tokenB.target);
    await tx.wait();

    // Obtener la dirección del pool creado
    const poolAddress = await factory.obtenerPool(tokenA.target, tokenB.target);
    pool = await ethers.getContractAt("DEXPool", poolAddress);
  });

  describe("1. Configuración Inicial y Fábrica", function () {
    it("Debería registrar correctamente las direcciones de token en orden correcto", async function () {
      const token0 = await pool.token0();
      const token1 = await pool.token1();

      // Los tokens deben estar ordenados alfanuméricamente
      const [t0Ordenado, t1Ordenado] =
        tokenA.target.toLowerCase() < tokenB.target.toLowerCase()
          ? [tokenA.target, tokenB.target]
          : [tokenB.target, tokenA.target];

      expect(token0).to.equal(t0Ordenado);
      expect(token1).to.equal(t1Ordenado);
    });

    it("Debería retornar las reservas en cero inicialmente", async function () {
      const [reserva0, reserva1] = await pool.obtenerReservas();
      expect(reserva0).to.equal(0n);
      expect(reserva1).to.equal(0n);
    });

    it("No debería permitir crear un pool duplicado", async function () {
      await expect(
        factory.crearPool(tokenA.target, tokenB.target)
      ).to.be.revertedWith("La piscina de liquidez ya existe");
    });
  });

  describe("2. Adición de Liquidez", function () {
    it("Debería permitir la adición inicial de liquidez y calcular los tokens LP usando la raíz cuadrada", async function () {
      const cantA = ethers.parseEther("100"); // 100 TKA
      const cantB = ethers.parseEther("400"); // 400 TKB

      // Determinar cuál es token0 y token1
      const token0Address = await pool.token0();
      const esA0 = tokenA.target === token0Address;
      const cant0 = esA0 ? cantA : cantB;
      const cant1 = esA0 ? cantB : cantA;

      // Aprobar tokens al pool
      await tokenA.connect(proveedor1).approve(pool.target, cantA);
      await tokenB.connect(proveedor1).approve(pool.target, cantB);

      // Agregar liquidez
      await expect(pool.connect(proveedor1).agregarLiquidez(cant0, cant1))
        .to.emit(pool, "LiquidezAgregada")
        .withArgs(proveedor1.address, cant0, cant1, ethers.parseEther("200")); // sqrt(100 * 400) = 200

      // Verificar que el proveedor1 recibió los tokens LP
      expect(await pool.balanceOf(proveedor1.address)).to.equal(ethers.parseEther("200"));

      // Verificar que las reservas se actualizaron correctamente
      const [reserva0, reserva1] = await pool.obtenerReservas();
      expect(reserva0).to.equal(cant0);
      expect(reserva1).to.equal(cant1);
    });

    it("Debería permitir adiciones subsecuentes manteniendo la proporción", async function () {
      const cant0Inicial = ethers.parseEther("100");
      const cant1Inicial = ethers.parseEther("100");

      // Primer depósito (Proveedor 1)
      await tokenA.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await tokenB.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await pool.connect(proveedor1).agregarLiquidez(cant0Inicial, cant1Inicial);

      // El pool ahora tiene reservas de 100 y 100, y el total supply de LP es sqrt(100*100) = 100
      expect(await pool.totalSupply()).to.equal(ethers.parseEther("100"));

      // Segundo depósito (Proveedor 2)
      // Si quiere depositar 50 de token0, debe depositar exactamente 50 de token1 para mantener la relación 1:1
      const cant0Proveedor2 = ethers.parseEther("50");
      const cant1Proveedor2Deseada = ethers.parseEther("60"); // Envía un excedente para ver si calcula la cantidad óptima

      await tokenA.connect(proveedor2).approve(pool.target, ethers.parseEther("200"));
      await tokenB.connect(proveedor2).approve(pool.target, ethers.parseEther("200"));

      const token0Address = await pool.token0();
      const esA0 = tokenA.target === token0Address;
      const cant0Input = esA0 ? cant0Proveedor2 : cant1Proveedor2Deseada;
      const cant1Input = esA0 ? cant1Proveedor2Deseada : cant0Proveedor2;

      // Al llamar a agregarLiquidez, el pool solo tomará 50 de cada uno
      await pool.connect(proveedor2).agregarLiquidez(cant0Input, cant1Input);

      // Verificar que el proveedor 2 recibió 50 tokens LP (proporcional: 50/100 * 100 = 50)
      expect(await pool.balanceOf(proveedor2.address)).to.equal(ethers.parseEther("50"));

      // El total de tokens LP emitidos debería ser 150
      expect(await pool.totalSupply()).to.equal(ethers.parseEther("150"));
    });
  });

  describe("3. Intercambio (Swaps)", function () {
    beforeEach(async function () {
      // Proveedor 1 agrega liquidez inicial: 100 token0 y 100 token1 (relación 1:1)
      const cantLP = ethers.parseEther("100");
      await tokenA.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await tokenB.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await pool.connect(proveedor1).agregarLiquidez(cantLP, cantLP);
    });

    it("Debería calcular y ejecutar un swap aplicando la comisión del 0.3%", async function () {
      const token0Address = await pool.token0();
      const esA0 = tokenA.target === token0Address;
      
      const tokenEntrada = esA0 ? tokenA : tokenB;
      const tokenSalida = esA0 ? tokenB : tokenA;

      const cantidadEntrada = ethers.parseEther("10"); // Trader quiere intercambiar 10 tokens

      // Aprobar el swap
      await tokenEntrada.connect(trader).approve(pool.target, cantidadEntrada);

      // Calcular la cantidad de salida esperada:
      // delta_y = (y * delta_x * 997) / (x * 1000 + delta_x * 997)
      // x = 100, y = 100, delta_x = 10
      // delta_y = (100 * 10 * 997) / (100 * 1000 + 10 * 997)
      // delta_y = 997000 / (100000 + 9970) = 997000 / 109970 = 9.0661089388...
      const resEntrada = ethers.parseEther("100");
      const resSalida = ethers.parseEther("100");
      const cantidadEntradaConComision = cantidadEntrada * 997n;
      const numerador = cantidadEntradaConComision * resSalida;
      const denominador = (resEntrada * 1000n) + cantidadEntradaConComision;
      const salidaEsperada = numerador / denominador;

      const balanceSalidaAntes = await tokenSalida.balanceOf(trader.address);

      // Ejecutar swap
      await expect(pool.connect(trader).swap(tokenEntrada.target, cantidadEntrada))
        .to.emit(pool, "Swap")
        .withArgs(trader.address, tokenEntrada.target, cantidadEntrada, salidaEsperada);

      // Verificar balances finales del trader
      const balanceSalidaDespues = await tokenSalida.balanceOf(trader.address);
      expect(balanceSalidaDespues - balanceSalidaAntes).to.equal(salidaEsperada);

      // Verificar que las reservas del pool aumentaron para el tokenEntrada y disminuyeron para el tokenSalida
      const [reserva0, reserva1] = await pool.obtenerReservas();
      const resEntradaFinal = esA0 ? reserva0 : reserva1;
      const resSalidaFinal = esA0 ? reserva1 : reserva0;

      expect(resEntradaFinal).to.equal(resEntrada + cantidadEntrada);
      expect(resSalidaFinal).to.equal(resSalida - salidaEsperada);
    });

    it("Debería revertir si se intenta hacer un swap con un token que no pertenece al par", async function () {
      const cantidad = ethers.parseEther("10");
      // Desplegamos un token externo que no pertenece al pool
      const tokenExterno = await BaseERC20.deploy("Token Externo", "EXT", owner.address);
      await tokenExterno.mint(trader.address, cantidad);
      await tokenExterno.connect(trader).approve(pool.target, cantidad);

      await expect(
        pool.connect(trader).swap(tokenExterno.target, cantidad)
      ).to.be.revertedWith("Token de entrada no pertenece al par");
    });

    it("Debería revertir si se intenta hacer un swap en un pool vacío (sin reservas)", async function () {
      const cantidad = ethers.parseEther("10");
      const tokenC = await BaseERC20.deploy("Token C", "TKC", owner.address);
      
      // Creamos un pool nuevo vacío
      const tx = await factory.crearPool(tokenA.target, tokenC.target);
      await tx.wait();
      const poolVacioAddress = await factory.obtenerPool(tokenA.target, tokenC.target);
      const poolVacio = await ethers.getContractAt("DEXPool", poolVacioAddress);

      await tokenA.connect(trader).approve(poolVacio.target, cantidad);
      
      await expect(
        poolVacio.connect(trader).swap(tokenA.target, cantidad)
      ).to.be.revertedWith("Reservas insuficientes en el pool");
    });
  });

  describe("4. Retiro de Liquidez y Acumulación de Comisiones", function () {
    it("Debería permitir retirar la liquidez y recuperar el balance proporcional", async function () {
      const cantLP = ethers.parseEther("100");

      // Proveedor 1 agrega 100 y 100
      await tokenA.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await tokenB.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await pool.connect(proveedor1).agregarLiquidez(cantLP, cantLP);

      // Proveedor 1 retira el 50% de su liquidez (50 LP tokens)
      const cantARemover = ethers.parseEther("50");
      const balanceAAntes = await tokenA.balanceOf(proveedor1.address);
      const balanceBAntes = await tokenB.balanceOf(proveedor1.address);

      await pool.connect(proveedor1).removerLiquidez(cantARemover);

      const balanceADespues = await tokenA.balanceOf(proveedor1.address);
      const balanceBDespues = await tokenB.balanceOf(proveedor1.address);

      // Debería recuperar 50 de cada token
      expect(balanceADespues - balanceAAntes).to.equal(ethers.parseEther("50"));
      expect(balanceBDespues - balanceBAntes).to.equal(ethers.parseEther("50"));

      // El total supply LP debería ser ahora 50
      expect(await pool.totalSupply()).to.equal(ethers.parseEther("50"));
    });

    it("Debería demostrar que el proveedor acumula ganancias de las comisiones generadas por los swaps", async function () {
      const cantLP = ethers.parseEther("100");

      // Proveedor 1 agrega 100 de token0 y 100 de token1
      await tokenA.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await tokenB.connect(proveedor1).approve(pool.target, ethers.parseEther("200"));
      await pool.connect(proveedor1).agregarLiquidez(cantLP, cantLP);

      // Trader realiza múltiples swaps grandes para generar volumen y comisiones en el pool
      // 1. Trader vende 20 de tokenA al pool
      const token0Address = await pool.token0();
      const esA0 = tokenA.target === token0Address;
      const tokenEntrada = esA0 ? tokenA : tokenB;
      const tokenSalida = esA0 ? tokenB : tokenA;

      await tokenEntrada.connect(trader).approve(pool.target, ethers.parseEther("100"));
      await pool.connect(trader).swap(tokenEntrada.target, ethers.parseEther("20"));

      // 2. Trader vende 20 de tokenB al pool para devolver equilibrio y dejar comisiones en ambos lados
      await tokenSalida.connect(trader).approve(pool.target, ethers.parseEther("100"));
      await pool.connect(trader).swap(tokenSalida.target, ethers.parseEther("20"));

      // Las reservas totales de tokens del pool ahora han crecido gracias a las comisiones del 0.3%.
      // Al retirar el 100% de la liquidez, el proveedor 1 debería obtener MÁS tokens
      // de los que depositó originalmente debido al interés acumulado por volumen operado.
      const tokensLPProveedor = await pool.balanceOf(proveedor1.address);
      await pool.connect(proveedor1).removerLiquidez(tokensLPProveedor);

      const balanceADespues = await tokenA.balanceOf(proveedor1.address);
      const balanceBDespues = await tokenB.balanceOf(proveedor1.address);
      const sumaBalancesDespues = balanceADespues + balanceBDespues;

      // El proveedor depositó originalmente 100 TKA y 100 TKB.
      // Su balance inicial total de TKA y TKB era 10000 + 10000 = 20000.
      // Al retirar la liquidez después del swap con comisión, debe recuperar en total más de 200 tokens,
      // por ende, la suma de balances después del retiro de liquidez debe ser mayor a 20000.
      expect(sumaBalancesDespues).to.be.greaterThan(ethers.parseEther("20000"));
    });
  });
});
