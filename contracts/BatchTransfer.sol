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

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

/**
 * @title BatchTransfer
 * @dev Contrato que facilita el envío por lotes de tokens ERC20 a múltiples direcciones.
 * Permite optimizar el costo de gas consolidando múltiples transferencias y
 * opcionalmente utilizando firmas de tipo Permit (EIP-2612) para evitar transacciones
 * independientes de aprobación.
 */
contract BatchTransfer {
    using SafeERC20 for IERC20;

    // Evento emitido al completar una transferencia por lotes
    event TransferenciaPorLote(
        address indexed token,
        address indexed emisor,
        uint256 cantidadTotal,
        uint256 numeroDestinatarios
    );

    /**
     * @notice Transfiere una cantidad específica de tokens ERC20 a un arreglo de destinatarios.
     * @dev El emisor debe haber aprobado previamente al contrato para gastar la cantidad total (amount * recipients.length).
     * @param token Dirección del contrato del token ERC20.
     * @param amount Cantidad de tokens a enviar a cada uno de los destinatarios.
     * @param recipients Arreglo de direcciones que recibirán los tokens.
     */
    function batchTransfer(
        address token,
        uint256 amount,
        address[] calldata recipients
    ) external {
        uint256 length = recipients.length;
        require(length > 0, "Debe proporcionar al menos un destinatario");
        require(amount > 0, "La cantidad a transferir debe ser mayor a cero");
        require(token != address(0), "Direccion del token no valida");

        uint256 totalAmount = amount * length;
        IERC20 erc20Token = IERC20(token);

        // Transferir el total acumulado desde el emisor al contrato
        erc20Token.safeTransferFrom(msg.sender, address(this), totalAmount);

        // Realizar la distribución a cada destinatario
        for (uint256 i = 0; i < length; i++) {
            address recipient = recipients[i];
            require(recipient != address(0), "Direccion de destinatario no valida");
            erc20Token.safeTransfer(recipient, amount);
        }

        emit TransferenciaPorLote(token, msg.sender, totalAmount, length);
    }

    /**
     * @notice Transfiere tokens ERC20 a múltiples destinatarios utilizando el estándar ERC20Permit (EIP-2612).
     * @dev Permite realizar la aprobación del gasto y la transferencia masiva en la misma transacción on-chain.
     * @param token Dirección del contrato del token ERC20 (debe implementar IERC20Permit).
     * @param amount Cantidad de tokens a enviar a cada uno de los destinatarios.
     * @param recipients Arreglo de direcciones de los destinatarios.
     * @param deadline Tiempo límite de validez para la firma de aprobación.
     * @param v Componente v de la firma ECDSA.
     * @param r Componente r de la firma ECDSA.
     * @param s Componente s de la firma ECDSA.
     */
    function batchTransferWithPermit(
        address token,
        uint256 amount,
        address[] calldata recipients,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        uint256 length = recipients.length;
        require(length > 0, "Debe proporcionar al menos un destinatario");
        require(amount > 0, "La cantidad a transferir debe ser mayor a cero");
        require(token != address(0), "Direccion del token no valida");

        uint256 totalAmount = amount * length;

        // Intentar ejecutar la función permit para realizar la aprobación en esta misma transacción
        try IERC20Permit(token).permit(msg.sender, address(this), totalAmount, deadline, v, r, s) {} catch {
            // Se captura la falla en caso de que el token ya tenga suficiente aprobación asignada previamente
        }

        IERC20 erc20Token = IERC20(token);

        // Transferir el total acumulado desde el emisor al contrato
        erc20Token.safeTransferFrom(msg.sender, address(this), totalAmount);

        // Realizar la distribución a cada destinatario
        for (uint256 i = 0; i < length; i++) {
            address recipient = recipients[i];
            require(recipient != address(0), "Direccion de destinatario no valida");
            erc20Token.safeTransfer(recipient, amount);
        }

        emit TransferenciaPorLote(token, msg.sender, totalAmount, length);
    }
}
