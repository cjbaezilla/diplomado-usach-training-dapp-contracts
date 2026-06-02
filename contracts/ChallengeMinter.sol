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

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @dev Interfaz simplificada para interactuar con el contrato BaseERC1155 ya existente
 * y delegar la acuñación de insignias.
 */
interface IBaseERC1155 {
    function mint(address account, uint256 id, uint256 amount, bytes memory data) external;
}

/**
 * @title ChallengeMinter
 * @author Diplomado USACH
 * @notice Contrato inteligente intermediario para el reclamo de recompensas en insignias (NFT ERC1155)
 * validado de forma off-chain por medio de firmas criptográficas ECDSA.
 *
 * Este contrato permite delegar la verificación del cumplimiento de un desafío (on-chain u off-chain)
 * a un servidor centralizado/backend que posee una clave privada. Si el desafío es válido, el servidor
 * emite una firma criptográfica que el usuario envía a este contrato. Luego, el contrato recupera el
 * firmante y, de ser válido, gatilla el minteo directo del NFT a favor del usuario.
 */
contract ChallengeMinter is AccessControl {
    using ECDSA for bytes32;

    // Rol reservado para las direcciones de servidores/backends autorizados para firmar reclamos
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");

    // Instancia del contrato NFT ERC1155
    IBaseERC1155 public immutable nftContract;

    // Mapeo para registrar qué hashes de mensajes firmados ya han sido utilizados
    // Esto previene los ataques de repetición (Replay Attacks)
    mapping(bytes32 => bool) public usedSignatures;

    // Evento gatillado cuando un usuario reclama con éxito un NFT de un desafío
    event ChallengeClaimed(
        address indexed user,
        uint256 indexed id,
        uint256 amount,
        bytes32 salt
    );

    /**
     * @notice Inicializa el contrato con el administrador inicial, firmante autorizado y el NFT destino.
     * @param defaultAdmin Dirección del administrador principal de este contrato.
     * @param authorizedSigner Dirección del servidor/clave pública autorizada para emitir firmas.
     * @param nftContractAddress Dirección del contrato BaseERC1155 previamente desplegado.
     */
    constructor(
        address defaultAdmin,
        address authorizedSigner,
        address nftContractAddress
    ) {
        require(nftContractAddress != address(0), "Direccion del NFT invalida");
        require(authorizedSigner != address(0), "Direccion del firmante invalida");
        require(defaultAdmin != address(0), "Direccion del administrador invalida");

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(SIGNER_ROLE, authorizedSigner);

        nftContract = IBaseERC1155(nftContractAddress);
    }

    /**
     * @notice Valida una firma criptográfica y acuña una recompensa en insignias.
     * @dev Reconstruye el hash del mensaje usando la dirección del usuario (msg.sender) para que nadie
     * más pueda interceptar la firma y usarla en su propio beneficio. También incluye la dirección
     * de este contrato para evitar que la firma sea reutilizada en otros contratos distribuidores similares.
     *
     * @param id ID de la insignia NFT (ERC1155) a reclamar.
     * @param salt Un valor único generado por el backend (nonce/UUID hash) para garantizar la unicidad de la firma.
     * @param signature La firma digital en formato de bytes (65 bytes) generada por el backend autorizado.
     */
    function claimChallenge(
        uint256 id,
        bytes32 salt,
        bytes memory signature
    ) external {
        // 1. Reconstruir el hash del mensaje localmente
        // El orden de los parámetros debe coincidir exactamente con el orden en que fueron firmados en el backend.
        // Removimos el parámetro amount y asumimos fijamente 1.
        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, id, salt, address(this))
        );

        // 2. Convertir el hash al formato estándar de firma de Ethereum (EIP-191)
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);

        // 3. Recuperar la dirección pública que firmó el mensaje
        address signer = ethSignedMessageHash.recover(signature);

        // 4. Verificar que el firmante posea el rol de firmante autorizado
        require(hasRole(SIGNER_ROLE, signer), "Firma invalida o no autorizada");

        // 5. Prevenir la reutilización de firmas (Ataque de Repetición / Replay Attack)
        require(!usedSignatures[messageHash], "Esta recompensa ya fue reclamada");
        
        // Registrar el hash del mensaje como consumido
        usedSignatures[messageHash] = true;

        // 6. Ejecutar la llamada de acuñación hacia el contrato de insignias BaseERC1155
        // Siempre se acuña exactamente 1 token
        nftContract.mint(msg.sender, id, 1, "");

        emit ChallengeClaimed(msg.sender, id, 1, salt);
    }
}
