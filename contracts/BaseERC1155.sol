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
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BaseERC1155 is ERC1155, AccessControl, ERC1155Burnable, ERC1155Supply {
    using Strings for uint256;

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin, address minter)
        ERC1155("https://cbaeza.com/nft/usach/badges/")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(URI_SETTER_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    /**
     * @dev Devuelve la URI de metadatos para un token ID específico.
     * Sobrescribe la implementación de ERC1155 para concatenar dinámicamente
     * la base URI actual con el ID en decimal y el sufijo '.json'.
     *
     * Ejemplo:
     * Si la base URI es 'https://cbaeza.com/nft/usach/badges/', al consultar el ID 42,
     * retornará: 'https://cbaeza.com/nft/usach/badges/42.json'.
     */
    function uri(uint256 id)
        public
        view
        override
        returns (string memory)
    {
        string memory baseURI = super.uri(id);
        
        // Si la URI base no está vacía, realizamos la concatenación dinámica
        if (bytes(baseURI).length > 0) {
            return string(abi.encodePacked(baseURI, id.toString(), ".json"));
        }
        
        return "";
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
