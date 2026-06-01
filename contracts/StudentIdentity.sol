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

/**
 * @title StudentIdentity
 * @dev Contrato para almacenar la identidad on-chain de los estudiantes del Diplomado USACH.
 * Permite a cualquier dirección registrar y actualizar sus datos de contacto y redes sociales.
 */
contract StudentIdentity {
    
    // Estructura que define el perfil de identidad de un estudiante
    struct Profile {
        string name;
        string email;
        string linkedin;
        string twitter;
        string avatar;
        uint256 updatedAt;
        bool isRegistered;
    }

    // Mapeo de dirección de wallet a perfil del estudiante
    mapping(address => Profile) private _profiles;

    // Arreglo de todas las direcciones de estudiantes registrados
    address[] private _registeredStudents;

    // Mapeo para verificar rápidamente la posición/existencia del estudiante en el array
    mapping(address => uint256) private _studentIndex; // 1-based index (0 significa no registrado en el array general)

    // Evento emitido cuando un perfil es registrado por primera vez
    event ProfileRegistered(
        address indexed studentAddress,
        string name,
        string email
    );

    // Evento emitido cuando un perfil existente es actualizado
    event ProfileUpdated(
        address indexed studentAddress,
        string name,
        string email,
        string linkedin,
        string twitter,
        string avatar,
        uint256 updatedAt
    );

    // Error personalizado para cuando se intenta registrar un nombre vacío
    error NameRequired();

    /**
     * @dev Permite a un estudiante registrar o actualizar su identidad on-chain.
     * @param name Nombre completo del estudiante. No puede estar vacío.
     * @param email Correo electrónico de contacto.
     * @param linkedin Enlace o nombre de usuario del perfil de LinkedIn.
     * @param twitter Enlace o nombre de usuario del perfil de Twitter.
     * @param avatar Enlace (URL) o hash IPFS de la imagen de avatar.
     */
    function setProfile(
        string calldata name,
        string calldata email,
        string calldata linkedin,
        string calldata twitter,
        string calldata avatar
    ) external {
        if (bytes(name).length == 0) {
            revert NameRequired();
        }

        Profile storage profile = _profiles[msg.sender];
        bool previouslyRegistered = profile.isRegistered;

        profile.name = name;
        profile.email = email;
        profile.linkedin = linkedin;
        profile.twitter = twitter;
        profile.avatar = avatar;
        profile.updatedAt = block.timestamp;

        if (!previouslyRegistered) {
            profile.isRegistered = true;
            _registeredStudents.push(msg.sender);
            _studentIndex[msg.sender] = _registeredStudents.length;
            emit ProfileRegistered(msg.sender, name, email);
        }

        emit ProfileUpdated(
            msg.sender,
            name,
            email,
            linkedin,
            twitter,
            avatar,
            block.timestamp
        );
    }

    /**
     * @dev Obtiene el perfil completo de un estudiante a partir de su dirección.
     * @param studentAddress Dirección Ethereum del estudiante.
     * @return name Nombre completo del estudiante.
     * @return email Correo electrónico.
     * @return linkedin Enlace a LinkedIn.
     * @return twitter Enlace a Twitter.
     * @return avatar Enlace al avatar.
     * @return updatedAt Timestamp de la última actualización.
     * @return isRegistered Indica si el estudiante está registrado.
     */
    function getProfile(address studentAddress)
        external
        view
        returns (
            string memory name,
            string memory email,
            string memory linkedin,
            string memory twitter,
            string memory avatar,
            uint256 updatedAt,
            bool isRegistered
        )
    {
        Profile memory profile = _profiles[studentAddress];
        return (
            profile.name,
            profile.email,
            profile.linkedin,
            profile.twitter,
            profile.avatar,
            profile.updatedAt,
            profile.isRegistered
        );
    }

    /**
     * @dev Retorna todas las direcciones de los estudiantes registrados.
     * @return Array de direcciones Ethereum.
     */
    function getAllRegisteredStudents() external view returns (address[] memory) {
        return _registeredStudents;
    }

    /**
     * @dev Retorna la cantidad total de estudiantes registrados.
     * @return Cantidad de registros.
     */
    function getStudentsCount() external view returns (uint256) {
        return _registeredStudents.length;
    }
}
