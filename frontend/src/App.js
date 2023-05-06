import React, { useEffect } from "react";
import useEth from "./contexts/EthContext/useEth";
import IncorrectChain from "./components/IncorrectChain";
import WalletNotConnected from "./components/WalletNotConnected";
import WalletNotFound from "./components/WalletNotFound";
import "./assets/styles/index.scss";
import { reducer, actions, initialState } from "./contexts/EthContext/state";
import { useLocation } from "react-router-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useRouteMatch,
} from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
    const { state, dispatch } = useEth();
    const location = useLocation();

    useEffect(() => {
        shutDownDropDown();
    }, [location.pathname]);

    if (!window.ethereum) {
        return <WalletNotFound />;
    }
    if (state && state.accounts && state.accounts.length <= 0) {
        return <WalletNotConnected state={state} />;
    }

    const shutDownDropDown = () => {
        dispatch({
            type: actions.toggleBackdrop,
            data: false,
        });
    };

    return (
        <>
            {console.log(state)}
            <NavBar state={state} />
            <div
                className={`backdrop ${
                    state.backdrop ? "backdrop--active" : ""
                }`}
                onClick={shutDownDropDown}
            ></div>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route
                    path="/verify-certificate"
                    element={<VerifyCertificate />}
                />
            </Routes>
        </>
    );
}

export default App;
