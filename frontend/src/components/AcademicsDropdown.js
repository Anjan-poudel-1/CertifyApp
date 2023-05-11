import React from "react";
import { useEth } from "../contexts/EthContext";
import { reducer, actions, initialState } from "../contexts/EthContext/state";
import { toast } from "react-toastify";

function AcademicsDropdown({ show, setShow, data }) {
    const { state, dispatch } = useEth();
    return (
        <div
            className={`account-dropdown ${
                show ? "account-dropdown--show" : ""
            }`}
        >
            <div className="account-dropdown__list">
                <div className="account-dropdown__list__data">Subjects</div>
            </div>
            <div className="account-dropdown__list">
                <div className="account-dropdown__list__data">Modules</div>
            </div>
            <div className="account-dropdown__list">
                <div className="account-dropdown__list__data">Result</div>
            </div>
            <div className="account-dropdown__list">
                <div className="account-dropdown__list__data">Certificate</div>
            </div>
        </div>
    );
}

export default AcademicsDropdown;
