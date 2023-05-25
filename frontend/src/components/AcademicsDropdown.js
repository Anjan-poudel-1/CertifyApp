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
                onClick={() => moveToPage("programs")}
            >
                <div className="account-dropdown__list__data">Programs</div>
            </div>
        </div>
    );
}

export default AcademicsDropdown;
