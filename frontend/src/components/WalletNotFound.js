import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import CompanyBranding from "./CompanyBranding";
function WalletNotFound() {
    const getWallet = () => {};
    return (
        <div className="page absolute-center-page">
            <div className="absolute-center-page__content">
                <CompanyBranding />
                <div className="wallet-not-connected">
                    <div className="wallet-not-connected__heading">
                        You do not have an ethereum wallet
                    </div>

                    <Button onClick={getWallet} className=" btn-primary">
                        Get a wallet
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default WalletNotFound;
