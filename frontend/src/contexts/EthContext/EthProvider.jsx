import React, { useReducer, useCallback, useEffect } from "react";
import { Signer, ethers } from "ethers";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const init = useCallback(async (artifact) => {
        if (artifact) {
            // const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const accountsSigner = provider.getSigner();
            let accounts = [];
            try {
                accounts = await accountsSigner.getAddress();
            } catch (err) {
                console.log(err);
            }
            const { chainId } = await provider.getNetwork();
            console.log(chainId);
            let networkID = chainId;
            const { abi } = artifact;
            let address, contract;
            try {
                address = "0x07A35164a8260CF6627486C79dF7b5c119D2c1a9";
                console.log(address, abi, provider);
                contract = new ethers.Contract(address, abi, accountsSigner);
            } catch (err) {
                console.error(err);
            }
            console.log(artifact, provider, accounts, networkID, contract);
            dispatch({
                type: actions.init,
                data: { artifact, provider, accounts, networkID, contract },
            });
        }
    }, []);

    useEffect(() => {
        const tryInit = async () => {
            try {
                const artifact = require("../../contracts/Certify.json");
                init(artifact);
            } catch (err) {
                console.error(err);
            }
        };

        tryInit();
    }, [init]);

    useEffect(() => {
        if (window.ethereum) {
            const events = ["chainChanged", "accountsChanged"];
            const handleChange = () => {
                console.log("Chain or account changed");
                init(state.artifact);
            };

            events.forEach((e) => window.ethereum.on(e, handleChange));
            return () => {
                events.forEach((e) =>
                    window.ethereum.removeListener(e, handleChange)
                );
            };
        }
    }, [init, state.artifact]);

    return (
        <EthContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </EthContext.Provider>
    );
}

export default EthProvider;
