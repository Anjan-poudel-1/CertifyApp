require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts

module.exports = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            accounts: [process.env.SEPOLIA_PRIVATE_KEY],
        },
        ganache: {
            url: "HTTP://127.0.0.1:7545",
            accounts: [process.env.GANACHE_PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_SEPOLIA_KEY,
        },
    },
};
