/*
888     888  .d8888b.        d8888  .d8888b.  888    888 
888     888 d88P  Y88b      d88888 d88P  Y88b 888    888 
888     888 Y88b.          d88P888 888    888 888    888 
888     888  "Y888b.      d88P 888 888        8888888888 
888     888     "Y88b.   d88P  888 888        888    888 
888     888       "888  d88P   888 888    888 888    888 
Y88b. .d88P Y88b  d88P d8888888888 Y88b  d88P 888    888 
 "Y88888P"   "Y8888P" d88P     888  "Y8888P"  888    888 
*/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title WETH (Wrapped Ether)
 * @dev Port del contrato WETH9 original adaptado a Solidity 0.8.35.
 * Permite envolver Ether (ETH) en un token compatible con el estándar ERC-20.
 * Todos los comentarios y documentación están redactados en español de acuerdo con las directrices.
 */
contract WETH {
    string public constant name = "Wrapped Ether";
    string public constant symbol = "WETH";
    uint8 public constant decimals = 18;

    // Eventos estándar ERC-20 y específicos de WETH
    event Approval(address indexed src, address indexed guy, uint256 wad);
    event Transfer(address indexed src, address indexed dst, uint256 wad);
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    // Mapeos de balances y autorizaciones
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    /**
     * @dev Función para recibir Ether directamente. Cualquier transferencia directa de ETH
     * al contrato disparará esta función, envolviéndolo de manera automática.
     */
    receive() external payable {
        deposit();
    }

    /**
     * @dev Convierte el Ether enviado en tokens WETH para el remitente.
     */
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Quema tokens WETH del remitente para transferirle una cantidad equivalente de Ether.
     * @param wad Cantidad de tokens WETH a retirar y desenvolver.
     */
    function withdraw(uint256 wad) public {
        require(balanceOf[msg.sender] >= wad, "WETH: saldo insuficiente");
        
        // Se aplica Checks-Effects-Interactions: restar el saldo antes de la llamada de transferencia
        balanceOf[msg.sender] -= wad;
        
        // Transferencia segura utilizando call de bajo nivel para compatibilidad con billeteras multifirma/contratos
        (bool success, ) = msg.sender.call{value: wad}("");
        require(success, "WETH: fallo al enviar Ether");
        
        emit Withdrawal(msg.sender, wad);
    }

    /**
     * @dev Retorna el suministro total en circulación de WETH.
     * Es equivalente al balance total de Ether en posesión del contrato.
     */
    function totalSupply() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Aprueba a un tercero para que pueda transferir tokens en nombre del remitente.
     * @param guy Dirección del tercero autorizado.
     * @param wad Cantidad de tokens autorizados.
     */
    function approve(address guy, uint256 wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }

    /**
     * @dev Transfiere tokens del remitente a un destinatario.
     * @param dst Dirección del destinatario.
     * @param wad Cantidad de tokens a transferir.
     */
    function transfer(address dst, uint256 wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    /**
     * @dev Transfiere tokens de un emisor a un destinatario usando una autorización previa.
     * Si la autorización es infinita (type(uint256).max), no se reduce para ahorrar gas.
     * @param src Dirección del emisor de los tokens.
     * @param dst Dirección del destinatario de los tokens.
     * @param wad Cantidad de tokens a transferir.
     */
    function transferFrom(address src, address dst, uint256 wad) public returns (bool) {
        require(balanceOf[src] >= wad, "WETH: saldo insuficiente del emisor");

        if (src != msg.sender && allowance[src][msg.sender] != type(uint256).max) {
            require(allowance[src][msg.sender] >= wad, "WETH: autorizacion insuficiente");
            allowance[src][msg.sender] -= wad;
        }

        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);

        return true;
    }
}
