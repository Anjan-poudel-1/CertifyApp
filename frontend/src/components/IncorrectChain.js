import React from "react";

function IncorrectChain() {
    const switchToSepolia = () => {
        console.log("Switch to arbitrum goerli chain");
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x66eed" }],
        });
    };
    return (
        <div className="incorrect-chain">
            {" "}
            You are in wrong chain, switch to{" "}
            <u style={{ cursor: "pointer" }} onClick={switchToSepolia}>
                Arbitrum Goerli
            </u>
        </div>
    );
}

export default IncorrectChain;
