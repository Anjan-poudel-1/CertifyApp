const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Certify", function () {
    let Certify, certify, admin, user, newAdmin;
    const studentId = "STU001";
    const studentName = "Sarthak Shah";
    const enrolledYear = 2022;
    const enrolledProgram = "Computer Science";
    const certificateId = "CERT001";
    const imageHash = "QmZP3Gy9H8zwF83BiigkUiR9UcA1prQgpxjfrDwPVwLE1F";
    const generatedDate = "2023-05-24";
    const studentAcademics = {
        firstYearPercent: 8000,
        secondYearPercent: 8500,
        thirdYearPercent: 9000,
        finalYearPercent: 9500,
    };

    beforeEach(async function () {
        Certify = await ethers.getContractFactory("Certify");
        certify = await Certify.deploy();

        [admin, user, newAdmin] = await ethers.getSigners();
    });

    describe("Deployment", function () {
        it("Should set the right admin", async function () {
            expect(await certify.admin()).to.equal(admin.address);
        });

        it("Should have the right name and symbol", async function () {
            expect(await certify.name()).to.equal("Certify");
            expect(await certify.symbol()).to.equal("CER");
        });
    });

    describe("Admin actions", function () {
        it("Should enroll a student", async function () {
            await certify
                .connect(admin)
                .enrollStudent(
                    studentId,
                    studentName,
                    user.address,
                    enrolledYear,
                    enrolledProgram
                );

            const student = await certify.students(studentId);

            expect(student.stuId).to.equal(studentId);
            expect(student.stuName).to.equal(studentName);
            expect(student.stuWallet).to.equal(user.address);
            expect(student.enrolledYear).to.equal(enrolledYear);
            expect(student.enrolledProgram).to.equal(enrolledProgram);
        });

        it("Should change admin", async function () {
            await certify.connect(admin).changeAdmin(newAdmin.address);

            expect(await certify.admin()).to.equal(newAdmin.address);
        });

        it("Should update student academics", async function () {
            await certify
                .connect(admin)
                .enrollStudent(
                    studentId,
                    studentName,
                    user.address,
                    enrolledYear,
                    enrolledProgram
                );
            await certify
                .connect(admin)
                .updateAcademics(studentId, studentAcademics);

            const updatedAcademics = await certify.studentAcademics(studentId);

            expect(updatedAcademics.firstYearPercent).to.equal(
                studentAcademics.firstYearPercent
            );
            expect(updatedAcademics.secondYearPercent).to.equal(
                studentAcademics.secondYearPercent
            );
            expect(updatedAcademics.thirdYearPercent).to.equal(
                studentAcademics.thirdYearPercent
            );
            expect(updatedAcademics.finalYearPercent).to.equal(
                studentAcademics.finalYearPercent
            );
        });

        it("Should add student certificate", async function () {
            await certify
                .connect(admin)
                .enrollStudent(
                    studentId,
                    studentName,
                    user.address,
                    enrolledYear,
                    enrolledProgram
                );
            await certify
                .connect(admin)
                .addStudentCertificate(
                    studentId,
                    certificateId,
                    imageHash,
                    generatedDate
                );

            const certificate = await certify.studentCertificates(
                certificateId
            );

            expect(certificate.certificateId).to.equal(certificateId);
            expect(certificate.imageHash).to.equal(imageHash);
            expect(certificate.generatedDate).to.equal(generatedDate);
            expect(certificate.ownerAddress).to.equal(user.address);
        });
    });

    describe("User actions", function () {
        it("Should claim NFT", async function () {
            await certify
                .connect(admin)
                .enrollStudent(
                    studentId,
                    studentName,
                    user.address,
                    enrolledYear,
                    enrolledProgram
                );
            await certify
                .connect(admin)
                .addStudentCertificate(
                    studentId,
                    certificateId,
                    imageHash,
                    generatedDate
                );

            await certify.connect(user).claimNFT();

            const ownerOfToken = await certify.ownerOf(1);
            expect(ownerOfToken).to.equal(user.address);
        });
    });
    describe("Admin restricted actions", function () {
        it("Non-admin should not be able to enroll a student", async function () {
            await expect(
                certify
                    .connect(user)
                    .enrollStudent(
                        studentId,
                        studentName,
                        user.address,
                        enrolledYear,
                        enrolledProgram
                    )
            ).to.be.revertedWith(
                "Only the admin is allowed to call the function"
            );
        });

        it("Non-admin should not be able to add a student certificate", async function () {
            await expect(
                certify
                    .connect(user)
                    .addStudentCertificate(
                        studentId,
                        certificateId,
                        imageHash,
                        generatedDate
                    )
            ).to.be.revertedWith(
                "Only the admin is allowed to call the function"
            );
        });

        it("Admin should not be able to claim NFT", async function () {
            await certify
                .connect(admin)
                .enrollStudent(
                    studentId,
                    studentName,
                    user.address,
                    enrolledYear,
                    enrolledProgram
                );
            await certify
                .connect(admin)
                .addStudentCertificate(
                    studentId,
                    certificateId,
                    imageHash,
                    generatedDate
                );

            await expect(certify.connect(admin).claimNFT()).to.be.revertedWith(
                "ONly student allowed to mint"
            );
        });
    });

    describe("Token URI", function () {
        it("Should return a valid token URI", async function () {
            await certify
                .connect(admin)
                .enrollStudent(
                    studentId,
                    studentName,
                    user.address,
                    enrolledYear,
                    enrolledProgram
                );
            await certify
                .connect(admin)
                .addStudentCertificate(
                    studentId,
                    certificateId,
                    imageHash,
                    generatedDate
                );
            await certify.connect(user).claimNFT();

            const tokenURI = await certify.tokenURI(1);
            expect(tokenURI).to.be.a("string");
            expect(tokenURI.startsWith("data:application/json;base64,")).to.be
                .true;
        });
    });
});
