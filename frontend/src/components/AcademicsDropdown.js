import React from "react";
import { useEth } from "../contexts/EthContext";
import { reducer, actions, initialState } from "../contexts/EthContext/state";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function AcademicsDropdown({ show, setShow, data }) {
    const { state, dispatch } = useEth();
    const navigate = useNavigate();

    const moveToPage = (path) => {
        navigate(`/${path}`);
    };
    return (
        <div
            className={`account-dropdown ${
                show ? "account-dropdown--show" : ""
            }`}
        >
            <div
                className="account-dropdown__list"
                onClick={() => moveToPage("subjects")}
            >
                <div className="account-dropdown__list__data">Subjects</div>
            </div>
            <div
                className="account-dropdown__list"
                onClick={() => moveToPage("modules")}
            >
                <div className="account-dropdown__list__data">Modules</div>
            </div>
            <div
                className="account-dropdown__list"
                onClick={() => moveToPage("results")}
            >
                <div className="account-dropdown__list__data">Results</div>
            </div>
            <div
                className="account-dropdown__list"
                onClick={() => moveToPage("certificate")}
            >
                <div className="account-dropdown__list__data">Certificate</div>
            </div>
        </div>
    );
}

export default AcademicsDropdown;
