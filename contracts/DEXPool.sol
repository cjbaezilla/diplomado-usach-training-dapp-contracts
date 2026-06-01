/*
888     888  .d8888b.        d8888  .d8888b.  888    888 
888     888 d88P  Y88b      d88888 d88P  Y88b 888    888 
888     888 Y88b.          d88P888 888    888 888    888 
888     888  "Y888b.      d88P 888 888        8888888888 
888     888     "Y88b.   d88P  888 888        888    888 
888     888       "888  d88P   888 888    888 888    888 
Y88b. .d88P Y88b  d88P d8888888888 Y88b  d88P 888    888 
 "Y88888P"   "Y8888P" d88P     888  "Y8888P"  888    888 
________________________________________________________

Creado por Carlos Baeza Negroni para Diplomado USACH (Junio 2026)
Email: hola@cbaeza.com
Sitio Web: https://cbaeza.com
LinkedIn: https://www.linkedin.com/in/carlos-baeza-negroni/
GitHub: https://github.com/cjbaezilla/
*/
// SPDX-License-Identifier: MIT
pragma solidity 0.8.35;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DEXPool
 * @dev Contrato educativo que representa una piscina de liquidez (Pool) para un par específico de tokens ERC20.
 * Implementa el modelo de Creador de Mercado Automatizado (AMM) con la fórmula de producto constante: x * y = k.
 * El contrato en sí hereda de ERC20 para emitir "Acciones de Liquidez" (LP Tokens) a los proveedores de liquidez.
 */
contract DEXPool is ERC20, ReentrancyGuard {
    // Direcciones de los dos tokens que forman el par de intercambio
    address public immutable token0;
    address public immutable token1;

    // Reservas de cada token almacenadas en el contrato
    uint256 public reserve0;
    uint256 public reserve1;

    // Eventos informativos para el seguimiento en el frontend o pruebas
    event LiquidezAgregada(address indexed proveedor, uint256 cantidad0, uint256 cantidad1, uint256 tokensLP);
    event LiquidezRemovida(address indexed proveedor, uint256 cantidad0, uint256 cantidad1, uint256 tokensLP);
    event Swap(address indexed usuario, address indexed tokenEntrada, uint256 cantidadEntrada, uint256 cantidadSalida);

    /**
     * @dev Configura el par de tokens del pool. Se requiere que token0 < token1 alfanuméricamente
     * para asegurar una identificación única y ordenada del par.
     */
    constructor(address _token0, address _token1) ERC20("USACH LP Token", "LP-USACH") {
        require(_token0 != address(0) && _token1 != address(0), "Direcciones de token invalidas");
        require(_token0 < _token1, "Los tokens deben estar ordenados");
        token0 = _token0;
        token1 = _token1;
    }

    /**
     * @dev Devuelve las reservas actuales del pool.
     */
    function obtenerReservas() external view returns (uint256 _reserve0, uint256 _reserve1) {
        return (reserve0, reserve1);
    }

    /**
     * @dev Algoritmo de Babilonia para el cálculo de la raíz cuadrada entera.
     * Es fundamental para calcular la emisión inicial de tokens LP en base al producto geométrico.
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // Si y es 0, z implícitamente retorna 0
    }

    /**
     * @dev Agrega liquidez al pool.
     * - Si es el primer depósito, las acciones de LP emitidas serán iguales a sqrt(cantidad0 * cantidad1).
     * - Si ya hay liquidez, el usuario debe depositar tokens manteniendo la proporción actual (reserva1 / reserva0).
     *   El contrato calcula la cantidad óptima del segundo token a depositar y emite acciones LP proporcionales.
     */
    function agregarLiquidez(
        uint256 cantidad0Deseada,
        uint256 cantidad1Deseada
    ) external nonReentrant returns (uint256 liquidez) {
        uint256 _reserve0 = reserve0;
        uint256 _reserve1 = reserve1;

        uint256 cantidad0;
        uint256 cantidad1;

        // Caso 1: Primer depósito (Piscina vacía)
        if (_reserve0 == 0 && _reserve1 == 0) {
            cantidad0 = cantidad0Deseada;
            cantidad1 = cantidad1Deseada;
            liquidez = sqrt(cantidad0 * cantidad1);
        } 
        // Caso 2: Depósitos subsecuentes (Se debe mantener la proporción de precios actual)
        else {
            // cantidad1Optima = (cantidad0Deseada * reserve1) / reserve0
            uint256 cantidad1Optima = (cantidad0Deseada * _reserve1) / _reserve0;
            if (cantidad1Optima <= cantidad1Deseada) {
                cantidad0 = cantidad0Deseada;
                cantidad1 = cantidad1Optima;
            } else {
                // Si la cantidad1 optima supera la deseada, calculamos al revés
                uint256 cantidad0Optima = (cantidad1Deseada * _reserve0) / _reserve1;
                require(cantidad0Optima <= cantidad0Deseada, "Proporcion de liquidez no cumple los limites");
                cantidad0 = cantidad0Optima;
                cantidad1 = cantidad1Deseada;
            }

            // La cantidad de tokens LP a emitir es la menor proporción aportada de ambos tokens
            uint256 liquidez0 = (cantidad0 * totalSupply()) / _reserve0;
            uint256 liquidez1 = (cantidad1 * totalSupply()) / _reserve1;
            liquidez = liquidez0 < liquidez1 ? liquidez0 : liquidez1;
        }

        require(liquidez > 0, "Liquidez emitida insuficiente");

        // Transferir los tokens desde el proveedor al contrato
        // Requiere aprobación previa (approve) de ambos tokens al contrato de este pool
        IERC20(token0).transferFrom(msg.sender, address(this), cantidad0);
        IERC20(token1).transferFrom(msg.sender, address(this), cantidad1);

        // Acuñar (mint) las acciones de liquidez ERC20 al proveedor
        _mint(msg.sender, liquidez);

        // Actualizar las reservas internas basadas en el balance real del contrato
        reserve0 = IERC20(token0).balanceOf(address(this));
        reserve1 = IERC20(token1).balanceOf(address(this));

        emit LiquidezAgregada(msg.sender, cantidad0, cantidad1, liquidez);
    }

    /**
     * @dev Retira liquidez del pool quemando tokens LP y devolviendo los tokens subyacentes.
     * La cantidad de tokens devuelta es proporcional a la participación (acciones LP) del usuario
     * sobre las reservas totales.
     */
    function removerLiquidez(uint256 cantidadLP) external nonReentrant returns (uint256 cantidad0, uint256 cantidad1) {
        require(cantidadLP > 0, "Cantidad de LP debe ser mayor a cero");
        uint256 _totalSupply = totalSupply();
        require(_totalSupply > 0, "No hay liquidez en el pool");

        // Calcular la parte proporcional de reservas correspondientes a la liquidez a remover
        cantidad0 = (cantidadLP * reserve0) / _totalSupply;
        cantidad1 = (cantidadLP * reserve1) / _totalSupply;

        require(cantidad0 > 0 && cantidad1 > 0, "Cantidad de salida insuficiente");

        // Quemar los tokens LP del proveedor
        _burn(msg.sender, cantidadLP);

        // Transferir los tokens subyacentes de regreso al proveedor
        IERC20(token0).transfer(msg.sender, cantidad0);
        IERC20(token1).transfer(msg.sender, cantidad1);

        // Actualizar las reservas internas basadas en el balance real del contrato
        reserve0 = IERC20(token0).balanceOf(address(this));
        reserve1 = IERC20(token1).balanceOf(address(this));

        emit LiquidezRemovida(msg.sender, cantidad0, cantidad1, cantidadLP);
    }

    /**
     * @dev Realiza un swap (intercambio) entre los dos tokens del pool.
     * Implementa la comisión del 0.3% para incentivar a los proveedores de liquidez.
     * Fórmula: (x + delta_x * 0.997) * (y - delta_y) = x * y
     * Despejando delta_y (cantidad de salida):
     * delta_y = (y * delta_x * 997) / (x * 1000 + delta_x * 997)
     */
    function swap(address tokenEntrada, uint256 cantidadEntrada) external nonReentrant returns (uint256 cantidadSalida) {
        require(tokenEntrada == token0 || tokenEntrada == token1, "Token de entrada no pertenece al par");
        require(cantidadEntrada > 0, "Cantidad de entrada debe ser mayor a cero");

        bool esToken0 = tokenEntrada == token0;
        address tokenSalida = esToken0 ? token1 : token0;
        uint256 resEntrada = esToken0 ? reserve0 : reserve1;
        uint256 resSalida = esToken0 ? reserve1 : reserve0;

        require(resEntrada > 0 && resSalida > 0, "Reservas insuficientes en el pool");

        // Aplicamos la comisión del 0.3% multiplicando por 997 y dividiendo por 1000
        uint256 cantidadEntradaConComision = cantidadEntrada * 997;
        uint256 numerador = cantidadEntradaConComision * resSalida;
        uint256 denominador = (resEntrada * 1000) + cantidadEntradaConComision;
        cantidadSalida = numerador / denominador;

        require(cantidadSalida > 0, "Cantidad de salida insuficiente");
        require(cantidadSalida < resSalida, "Liquidez de salida insuficiente en el pool");

        // Transferir el token de entrada desde el usuario al pool
        // Requiere aprobación previa (approve) del token de entrada al contrato de este pool
        IERC20(tokenEntrada).transferFrom(msg.sender, address(this), cantidadEntrada);

        // Transferir el token de salida desde el pool al usuario
        IERC20(tokenSalida).transfer(msg.sender, cantidadSalida);

        // Actualizar las reservas internas basadas en el balance real del contrato
        reserve0 = IERC20(token0).balanceOf(address(this));
        reserve1 = IERC20(token1).balanceOf(address(this));

        emit Swap(msg.sender, tokenEntrada, cantidadEntrada, cantidadSalida);
    }
}
