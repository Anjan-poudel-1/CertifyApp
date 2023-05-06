
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";

contract Certify is ERC721{

//here owner is the administrator.... 
uint public totalStudentsEnrolled=0; 
uint public usedDecimalPoints = 2;
address public admin;


struct Academics{
uint8 firstYearPercent;
uint8 secondYearPercent;
uint8 thirdYearPercent;
uint8 finalYearPercent;

}

struct Certificate{
    string certificateId;
    address ownerAddress;
    uint tokenId;
    string claimedDate;
}



struct Student{
    string stuId;
    address stuWallet;
    string stuName;
    uint8 enrolledYear;
    uint enrolledIndex;
    string enrolledProgram;
    bool isGraduated;
    bool hasClaimedCertificate;
    Certificate stuCertificate;

}

mapping (address=> string) public studentWallets; // here , wallet address is mapped to student id
mapping  (string=> Student) public students;   // here , studednt id is mapped to student details
mapping (string=>Certificate) public studentCertificates; //here, certificate id is mapped to student id
mapping (string=>Academics) public studentAcademics;    //here, student id is mapped to student marks
mapping (uint=>address) public tokenOwners; //here, tokenId is mapped to address who can mint...



constructor() ERC721("Certify","CER"){
        admin = msg.sender;
}

modifier onlyAdmin() {
    require(msg.sender == admin, "Only the admin is allowed to call the function");
    _;
}

function changeAdmin(address newAdmin) public onlyAdmin {
    require(newAdmin!= address(0),"Provide a valid adddress");
    admin = newAdmin;

}

function enrollStudent(string memory _studentId, string memory _stuName,address _stuWallet,string memory, uint8 _enrolledYear, string memory _enrolledProgram) public onlyAdmin {
  
    require(bytes(students[_studentId].stuId).length==0,"Student ID already enrolled");
    require(bytes(studentWallets[_stuWallet]).length==0,"Wallet already exist");

    
    students[_studentId].stuName = _stuName;
    students[_studentId].enrolledYear = _enrolledYear;
    
    students[_studentId].enrolledProgram = _enrolledProgram;
    students[_studentId].stuWallet = _stuWallet;
    studentWallets[_stuWallet] = _studentId;

    totalStudentsEnrolled++;
    students[_studentId].enrolledIndex = totalStudentsEnrolled;
}

function changeStudentWalletAddress(string memory _studentId,address _stuWallet)  public onlyAdmin{
    //  it gets new wallet address
     require(bytes(studentWallets[_stuWallet]).length==0,"Wallet already exist");
       require(bytes(students[_studentId].stuId).length>0,"Student ID doesnot exist");
       studentWallets[students[_studentId].stuWallet] ='';  //previous address ma '' id is mapped 
       students[_studentId].stuWallet =_stuWallet;    // naya wallet mapped

       studentWallets[_stuWallet] = _studentId;


}

function updateAcademics(string memory _studentId,Academics memory _studentAcademics) public onlyAdmin{
    require(bytes(students[_studentId].stuId).length>0,"Student doesnot exist");
    require(!students[_studentId].hasClaimedCertificate,"Cannot modify marks once certificate has been claimed");
    studentAcademics[_studentId]= _studentAcademics;

}


function getFinalPercentage(string memory _studentId) private view returns (uint _finalPer){

Academics memory stuAcademics = studentAcademics[_studentId];

_finalPer = (stuAcademics.finalYearPercent+stuAcademics.firstYearPercent+ stuAcademics.secondYearPercent+ stuAcademics.thirdYearPercent) / 4;



} 



function addStudentCertificate(string memory _studentId, string memory _certificateId) public onlyAdmin{

    //certificate dispatch vaepachi ko tokenID, ipfs bata .... tyo pani aaucha .. and we set it... similarly, nft pani release garincha
require(bytes(students[_studentId].stuCertificate.certificateId).length==0,"Certificate already generated");
require((studentCertificates[_certificateId].ownerAddress)==address(0),"Certificate has already been assigned");


uint _finalPercentage = getFinalPercentage(_studentId);
studentCertificates[_certificateId].ownerAddress = students[_studentId].stuWallet;
studentCertificates[_certificateId].certificateId = _certificateId;
students[_studentId].isGraduated=true;
studentCertificates[_certificateId].tokenId = students[_studentId].enrolledIndex;

}

function claimNFT() public{
    require(bytes(studentWallets[msg.sender]).length>0,"ONly student allowed to mint");
    string memory _stuId = studentWallets[msg.sender];
    uint _tokenId = students[_stuId].stuCertificate.tokenId;
    require(_tokenId>0,"Not eligible to claim"); // Admin has not set token id yet.
    require(!students[_stuId].hasClaimedCertificate,"NFT Already Claimed");

    _safeMint(msg.sender,_tokenId);
students[_stuId].hasClaimedCertificate =true;
}



// Getters .. to get data









}