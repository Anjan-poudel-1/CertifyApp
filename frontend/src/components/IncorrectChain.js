import React from "react";

function IncorrectChain() {
    const switchToSepolia = () => {
        console.log("Switch to sepolia chain");
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
        });
    };
    return (
        <div className="incorrect-chain">
            {" "}
            You are in wrong chain, switch to{" "}
            <u style={{ cursor: "pointer" }} onClick={switchToSepolia}>
                Sepolia chain
            </u>
        </div>
    );
}

export default IncorrectChain;
