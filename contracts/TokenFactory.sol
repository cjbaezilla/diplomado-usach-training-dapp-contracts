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
pragma solidity ^0.8.35;

import {BaseERC20} from "./BaseERC20.sol";

/**
 * @title TokenFactory
 * @dev Contrato para la creación y seguimiento de tokens BaseERC20.
 * Permite a los usuarios crear nuevos tokens y mantiene un registro de los propietarios y tokens creados.
 */
contract TokenFactory {
    // Array que almacena todas las direcciones de tokens creados
    address[] private _allTokens;

    // Mapeo de propietario a su lista de tokens creados
    mapping(address => address[]) private _tokensByOwner;

    // Mapeo para verificar rápidamente si un token fue creado por esta fábrica
    mapping(address => bool) private _isTokenCreatedByFactory;

    // Evento que se emite cuando se crea un nuevo token
    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol
    );

    /**
     * @dev Crea un nuevo contrato BaseERC20.
     * @param name Nombre del token.
     * @param symbol Símbolo del token.
     * @param initialOwner Dirección del propietario inicial del token.
     * @return Dirección del token recién creado.
     */
    function createToken(
        string memory name,
        string memory symbol,
        address initialOwner
    ) external returns (address) {
        require(initialOwner != address(0), "TokenFactory: el propietario no puede ser la direccion cero");

        // Desplegar el nuevo contrato BaseERC20
        BaseERC20 newToken = new BaseERC20(name, symbol, initialOwner);
        address tokenAddress = address(newToken);

        // Registrar el token
        _allTokens.push(tokenAddress);
        _tokensByOwner[initialOwner].push(tokenAddress);
        _isTokenCreatedByFactory[tokenAddress] = true;

        // Emitir el evento
        emit TokenCreated(tokenAddress, initialOwner, name, symbol);

        return tokenAddress;
    }

    /**
     * @dev Obtiene todos los tokens creados por la fábrica.
     * @return Array de direcciones de tokens.
     */
    function getAllTokens() external view returns (address[] memory) {
        return _allTokens;
    }

    /**
     * @dev Obtiene los tokens creados para un propietario específico.
     * @param owner Dirección del propietario.
     * @return Array de direcciones de tokens creados por el propietario.
     */
    function getTokensByOwner(address owner) external view returns (address[] memory) {
        return _tokensByOwner[owner];
    }

    /**
     * @dev Verifica si un token fue creado por esta fábrica.
     * @param tokenAddress Dirección del token a verificar.
     * @return true si el token fue creado por la fábrica, false en caso contrario.
     */
    function isTokenCreated(address tokenAddress) external view returns (bool) {
        return _isTokenCreatedByFactory[tokenAddress];
    }

    /**
     * @dev Obtiene la cantidad total de tokens creados.
     * @return Cantidad de tokens.
     */
    function getTokensCount() external view returns (uint256) {
        return _allTokens.length;
    }
}
