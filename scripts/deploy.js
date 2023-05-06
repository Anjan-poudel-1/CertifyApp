// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

// ethers is available in the global scope

const path = require("path");

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
                "gets automatically created and destroyed every time. Use the Hardhat" +
                " option '--network localhost'"
        );
    }

    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Certify = await ethers.getContractFactory("Certify");
    const certify = await Certify.deploy();
    await certify.deployed();

    console.log("The contract is deployed at", certify.address);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(certify);
}

function saveFrontendFiles(certify) {
    const fs = require("fs");
    const contractsDir = path.join(
        __dirname,
        "..",
        "frontend",
        "src",
        "contracts"
    );

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ Certify: certify.address }, undefined, 2)
    );

    const CertifyArtifact = artifacts.readArtifactSync("Certify");

    fs.writeFileSync(
        path.join(contractsDir, "Certify.json"),
        JSON.stringify(CertifyArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
