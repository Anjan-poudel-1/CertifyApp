import React, { useState, useReducer, useEffect } from "react";
import CertifyLogo from "../assets/images/certify_logo.png";
import { ReactComponent as WalletSVG } from "../assets/svgs/wallet.svg";
import IncorrectChain from "./IncorrectChain";
import { Link } from "react-router-dom";
import AccountDropDown from "./AccountDropDown";
import { reducer, actions, initialState } from "../contexts/EthContext/state";
import { useEth } from "../contexts/EthContext";
import AcademicsDropdown from "./AcademicsDropdown";
import { useLocation } from "react-router-dom";
function NavBar({}) {
    const [openAccounts, setOpenAccounts] = useState(false);
    const [openAcademics, setOpenAcademics] = useState(false);

    const { state, dispatch } = useEth();

    const location = useLocation();

    console.log(state);
    const walletClicked = () => {
        console.log("WAllet clicked");
        console.log(state);
        dispatch({
            type: actions.toggleBackdrop,
            data: !openAccounts,
        });
        setOpenAccounts(!openAccounts);
    };

    const academicsClicked = () => {
        dispatch({
            type: actions.toggleBackdrop,
            data: !openAcademics,
        });
        setOpenAcademics(!openAcademics);
    };

    useEffect(() => {
        setOpenAcademics(false);
        setOpenAccounts(false);
    }, [location.pathname]);

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
                    {state &&
                        state.userState &&
                        state.userState.isLoggedIn &&
                        state.userState.user.isAdmin && (
                            <div className="navbar__left__links">
                                <Link
                                    className="navbar__left__links__link"
                                    to="/students"
                                >
                                    Students
                                </Link>
                                <div
                                    className="navbar__right__wallet-container"
                                    onClick={academicsClicked}
                                >
                                    <div
                                        style={{
                                            cursor: "pointer",
                                            color: "#2660b7",
                                        }}
                                    >
                                        Academics
                                    </div>

                                    <AcademicsDropdown
                                        show={openAcademics}
                                        setShow={setOpenAcademics}
                                        data={state.userState.user}
                                    />
                                </div>
                            </div>
                        )}

                    {/* {state &&
                        state.userState &&
                        state.userState.isLoggedIn &&
                        !state.userState.user.isAdmin && <div>My Studies</div>} */}
                </div>
                <div className="navbar__right">
                    {/* If account logged in , show profile else show wallet address */}
                    <div className="navbar__right__wallet-container">
                        {state && state.accounts && (
                            <div
                                className="navbar__right__wallet"
                                onClick={walletClicked}
                            >
                                <div className="navbar__right__wallet__icon">
                                    <WalletSVG />
                                </div>
                                <div className="navbar__right__wallet__address">
                                    <>{state.accounts.slice(0, 4)}</>.....
                                    <>{state.accounts.slice(-4)}</>
                                </div>
                            </div>
                        )}
                        {state &&
                            state.userState &&
                            state.userState.isLoggedIn && (
                                <AccountDropDown
                                    show={openAccounts}
                                    setShow={setOpenAccounts}
                                    data={state.userState.user}
                                />
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
