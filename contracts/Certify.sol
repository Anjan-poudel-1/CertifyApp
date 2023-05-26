// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";

library Base64 {
    string internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // load the table into memory
        string memory table = TABLE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {

            } lt(dataPtr, endPtr) {

            } {
                dataPtr := add(dataPtr, 3)

                // read 3 bytes
                let input := mload(dataPtr)

                // write 4 characters
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(input, 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }

        return result;
    }
}

contract Certify is ERC721 {
    //here owner is the administrator....
    uint public totalStudentsEnrolled = 0;
    uint public usedDecimalPoints = 2;
    address public admin;

    struct Academics {
        uint firstYearPercent;
        uint secondYearPercent;
        uint thirdYearPercent;
        uint finalYearPercent;
    }

    struct Certificate {
        string certificateId;
        string imageHash;
        address ownerAddress;
        uint tokenId;
        string generatedDate;
    }

    struct Student {
        string stuId;
        address stuWallet;
        string stuName;
        string enrolledYear;
        uint enrolledIndex;
        string enrolledProgram;
        bool isGraduated;
        bool hasClaimedCertificate;
        string certificateId;
    }

    mapping(address => string) public studentWallets; // here , wallet address is mapped to student id
    mapping(string => Student) public students; // here , studednt id is mapped to student details
    mapping(string => Certificate) public studentCertificates; //here, certificate id is mapped to student id
    mapping(string => Academics) public studentAcademics; //here, student id is mapped to student marks
    mapping(uint => address) public tokenOwners; //here, tokenId is mapped to address who can mint...

    constructor() ERC721("Certify", "CER") {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only the admin is allowed to call the function"
        );
        _;
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Provide a valid adddress");
        admin = newAdmin;
    }

    function enrollStudent(
        string memory _studentId,
        string memory _stuName,
        address _stuWallet,
        string memory _enrolledYear,
        string memory _enrolledProgram
    ) public onlyAdmin {
        require(
            bytes(students[_studentId].stuId).length == 0,
            "Student ID already enrolled"
        );
        require(
            bytes(studentWallets[_stuWallet]).length == 0,
            "Wallet already exist"
        );

        students[_studentId].stuName = _stuName;
        students[_studentId].enrolledYear = _enrolledYear;
        students[_studentId].stuId = _studentId;

        students[_studentId].enrolledProgram = _enrolledProgram;
        students[_studentId].stuWallet = _stuWallet;
        studentWallets[_stuWallet] = _studentId;

        totalStudentsEnrolled++;
        students[_studentId].enrolledIndex = totalStudentsEnrolled;
    }

    function changeStudentWalletAddress(
        string memory _studentId,
        address _stuWallet
    ) public onlyAdmin {
        //  it gets new wallet address
        require(
            bytes(studentWallets[_stuWallet]).length == 0,
            "Wallet already exist"
        );
        require(
            bytes(students[_studentId].stuId).length > 0,
            "Student ID doesnot exist"
        );
        studentWallets[students[_studentId].stuWallet] = ""; //previous address ma '' id is mapped
        students[_studentId].stuWallet = _stuWallet; // naya wallet mapped

        studentWallets[_stuWallet] = _studentId;
    }

    function updateAcademics(
        string memory _studentId,
        Academics memory _studentAcademics
    ) public onlyAdmin {
        require(
            bytes(students[_studentId].stuId).length > 0,
            "Student doesnot exist"
        );
        require(
            !students[_studentId].isGraduated,
            "Cannot modify marks once certificate has been deployed"
        );
        studentAcademics[_studentId] = _studentAcademics;
    }

    function getFinalPercentage(
        string memory _studentId
    ) private view returns (uint _finalPer) {
        Academics memory stuAcademics = studentAcademics[_studentId];

        _finalPer =
            (stuAcademics.finalYearPercent +
                stuAcademics.firstYearPercent +
                stuAcademics.secondYearPercent +
                stuAcademics.thirdYearPercent) /
            4;
    }

    function addStudentCertificate(
        string memory _studentId,
        string memory _certificateId,
        string memory _imageHash,
        string memory _generatedDate
    ) public onlyAdmin {
        //certificate dispatch vaepachi ko tokenID, ipfs bata .... tyo pani aaucha .. and we set it... similarly, nft pani release garincha
        require(
            bytes(students[_studentId].certificateId).length == 0,
            "Certificate already generated"
        );
        require(
            (studentCertificates[_certificateId].ownerAddress) == address(0),
            "Certificate has already been assigned"
        );

        studentCertificates[_certificateId].ownerAddress = students[_studentId]
            .stuWallet;
        studentCertificates[_certificateId].imageHash = _imageHash;
        studentCertificates[_certificateId].generatedDate = _generatedDate;
        studentCertificates[_certificateId].certificateId = _certificateId;
        students[_studentId].isGraduated = true;
        students[_studentId].certificateId = _certificateId;

        studentCertificates[_certificateId].tokenId = students[_studentId]
            .enrolledIndex;
    }

    function claimNFT() public {
        require(
            bytes(studentWallets[msg.sender]).length > 0,
            "ONly student allowed to mint"
        );
        string memory _stuId = studentWallets[msg.sender];
        string memory _stuCertificateId = students[_stuId].certificateId;
        uint _tokenId = studentCertificates[_stuCertificateId].tokenId;

        require(_tokenId > 0, "Not eligible to claim"); // Admin has not set token id yet.
        require(!students[_stuId].hasClaimedCertificate, "NFT Already Claimed");
        tokenOwners[_tokenId] = msg.sender;
        _safeMint(msg.sender, _tokenId);
        students[_stuId].hasClaimedCertificate = true;
    }

    // Getters .. to get data

    function buildImage(uint256 _tokenId) private view returns (string memory) {
        address _studentAddress = tokenOwners[_tokenId];
        string memory _studentId = studentWallets[_studentAddress];
        string memory _studentName = students[_studentId].stuName;
        string memory _enrolledYear = students[_studentId].enrolledYear;

        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '<svg width="359" height="594" viewBox="0 0 359 594" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.99994" width="356" height="590" fill="#F1F1F1"/><path d="M1 0L356 25.813L1 87V0Z" fill="#B28069"/><path d="M355.5 4V92L0.5 4H355.5Z" fill="#BFA294"/><path d="M356.985 593.232L2.2353 564.184L357.778 506.236L356.985 593.232Z" fill="#B28069"/><path d="M2.01822 587.996L2.82046 500L357.003 591.233L2.01822 587.996Z" fill="#BFA294"/><line x1="40.9999" y1="399" x2="331" y2="399" stroke="black"  stroke-width="2"/><text x="16%" y="30%" fill="black"  font-weight="600" font-size="32" >Imperial College</text><text x="40%" y="73%" fill="black" font-size="22" >Alumni</text><text x="50%" y="64.5%" fill="black" text-anchor="middle" font-size="25">',
                                _studentName,
                                '</text><text x="33%" y="82.5%" fill="black" font-weight="600"  font-size="18">Batch of ',
                                _enrolledYear,
                                "</text></svg>"
                            )
                        )
                    )
                )
            );
    }

    function buildMetadata(
        uint256 _tokenId
    ) private view returns (string memory) {
        string memory _studentId = studentWallets[tokenOwners[_tokenId]];
        string memory _studentName = students[_studentId].stuName;
        string memory _enrolledYear = students[_studentId].enrolledYear;

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                _studentName,
                                '", "enrolledYear":"',
                                _enrolledYear,
                                '", "image": "',
                                buildImage(_tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    // To fetch the Token URI

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return buildMetadata(_tokenId);
    }
}
