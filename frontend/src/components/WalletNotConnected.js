import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import CompanyBranding from "./CompanyBranding";

function WalletNotConnected({ state }) {
    const navigate = useNavigate();

    const connectWallet = async () => {
        await state.provider.send("eth_requestAccounts", []);
        navigate("/");
    };

    return (
        <div className="page absolute-center-page">
            <div className="absolute-center-page__content">
                <CompanyBranding />
                <p style={{ opacity: "0.75", fontWeight: "600" }}>
                    Empowering Academic Credentials and Ensuring Trust
                </p>
                <div className="wallet-not-connected">
                    <div className="wallet-not-connected__heading">
                        You have not connected your wallet
                    </div>

                    <Button onClick={connectWallet} className=" btn-primary">
                        Connect wallet
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default WalletNotConnected;
