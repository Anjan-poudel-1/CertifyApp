import React, { useState, useReducer } from "react";
import CertifyLogo from "../assets/images/certify_logo.png";
import { ReactComponent as WalletSVG } from "../assets/svgs/wallet.svg";
import IncorrectChain from "./IncorrectChain";
import { Link } from "react-router-dom";
import AccountDropDown from "./AccountDropDown";
import { reducer, actions, initialState } from "../contexts/EthContext/state";
import { useEth } from "../contexts/EthContext";
function NavBar({}) {
    const [openAccounts, setOpenAccounts] = useState(false);

    const { state, dispatch } = useEth();
    console.log(dispatch);
    const walletClicked = () => {
        console.log("WAllet clicked");
        console.log(state);
        dispatch({
            type: actions.toggleBackdrop,
            data: !openAccounts,
        });
        setOpenAccounts(!openAccounts);
    };

    return (
        <div className="navbar ">
            {state.networkID &&
                state.networkID.toString() !==
                    `${process.env.REACT_APP_DEPLOYED_CHAINID}` && (
                    <IncorrectChain />
                )}
            <div className=" navbar-container container">
                <div className="navbar__left">
                    <div className="navbar__left__logo">
                        <Link to="/">
                            <img src={CertifyLogo} />
                        </Link>
                    </div>
                    <div className="navbar__left__links"></div>
                </div>
                <div className="navbar__right">
                    {/* If account logged in , show profile else show wallet address */}
                    <div className="navbar__right__wallet-container">
                        <div
                            className="navbar__right__wallet"
                            onClick={walletClicked}
                        >
                            <div className="navbar__right__wallet__icon">
                                <WalletSVG />
                            </div>
                            <div className="navbar__right__wallet__address">
                                <>A12X</>....<>2209</>
                            </div>
                        </div>
                        <AccountDropDown show={openAccounts} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
