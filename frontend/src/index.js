import React from "react";
import ReactDOM from "react-dom/client";
import { EthProvider } from "./contexts/EthContext";
// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <EthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </EthProvider>
    </React.StrictMode>
);
