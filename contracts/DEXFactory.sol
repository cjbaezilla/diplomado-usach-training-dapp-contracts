// SPDX-License-Identifier: MIT
pragma solidity 0.8.35;

import "./DEXPool.sol";

/**
 * @title DEXFactory
 * @dev Contrato educativo que actúa como una fábrica para desplegar y registrar piscinas de liquidez (DEXPool).
 * Asegura la unicidad de cada par de tokens e implementa consultas sencillas en español.
 */
contract DEXFactory {
    // Mapeo bidireccional: tokenA => tokenB => direccion del Pool
    mapping(address => mapping(address => address)) public obtenerPool;
    
    // Listado de todas las direcciones de pools creados para permitir iteración o visualización
    address[] public todosLosPools;

    // Evento emitido cada vez que se crea una nueva piscina de liquidez
    event PoolCreado(address indexed token0, address indexed token1, address pool, uint256 cantidadPools);

    /**
     * @dev Crea una nueva piscina de liquidez para el par especificado de tokens.
     * Ordena los tokens de forma interna para evitar la creación duplicada en orden inverso (por ejemplo, A-B y B-A).
     */
    function crearPool(address tokenA, address tokenB) external returns (address pool) {
        require(tokenA != tokenB, "Los tokens deben ser diferentes");
        
        // Ordenamos los tokens para mantener consistencia y unicidad
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        
        require(token0 != address(0), "La direccion del token no puede ser cero");
        require(obtenerPool[token0][token1] == address(0), "La piscina de liquidez ya existe");

        // Desplegar el nuevo contrato de la piscina de liquidez (DEXPool)
        pool = address(new DEXPool(token0, token1));

        // Registrar la dirección en el mapeo bidireccional
        obtenerPool[token0][token1] = pool;
        obtenerPool[token1][token0] = pool; // Facilita la consulta en ambas direcciones
        
        // Almacenar el pool en la lista global
        todosLosPools.push(pool);

        emit PoolCreado(token0, token1, pool, todosLosPools.length);
    }

    /**
     * @dev Devuelve el número total de piscinas de liquidez creadas.
     */
    function cantidadPools() external view returns (uint256) {
        return todosLosPools.length;
    }
}
