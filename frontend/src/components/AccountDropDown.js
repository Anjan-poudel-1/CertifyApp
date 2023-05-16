import React from "react";
import { useEth } from "../contexts/EthContext";
import { reducer, actions, initialState } from "../contexts/EthContext/state";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
function AccountDropDown({ show, setShow, data }) {
    const navigate = useNavigate();
    const { state, dispatch } = useEth();
    const copyAddress = (textToCopy) => {
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                console.log("Text copied to clipboard");
                toast.success("Address Copied Successfully");
            })
            .catch((error) => {
                console.error("Error copying text: ", error);
            });
    };
    const logout = () => {
        localStorage.setItem("certify", JSON.stringify({}));
        dispatch({
            type: actions.setUserState,
            data: {},
        });
        setShow(false);
        toast.success("Logged out successfully");
    };
    return (
        <div
            className={`account-dropdown ${
                show ? "account-dropdown--show" : ""
            }`}
        >
            <div className="account-dropdown__list">
                <div className="account-dropdown__list__svg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 64 64"
                        id="profile"
                    >
                        <path d="M32 42c8.271 0 15-8.523 15-19S40.271 4 32 4s-15 8.523-15 19 6.729 19 15 19zm0-34c5.963 0 11 6.869 11 15s-5.037 15-11 15-11-6.869-11-15S26.037 8 32 8z"></path>
                        <path d="M4.103 45.367l-4 12A2.001 2.001 0 0 0 2 60h60c.643 0 1.247-.309 1.622-.831a1.997 1.997 0 0 0 .275-1.802l-4-12a2.001 2.001 0 0 0-1.348-1.29l-14-4a1.991 1.991 0 0 0-1.444.134L32 45.764l-11.105-5.553a1.996 1.996 0 0 0-1.444-.134l-14 4a2 2 0 0 0-1.348 1.29zm15.699-1.23l11.304 5.652a2.004 2.004 0 0 0 1.789 0l11.304-5.652 12.238 3.496L59.226 56H4.774l2.789-8.367 12.239-3.496z"></path>
                    </svg>
                </div>
                <div className="account-dropdown__list__data">{data.name}</div>
            </div>

            <div
                className="account-dropdown__list"
                onClick={() => navigate("/account-settings")}
            >
                <div className="account-dropdown__list__svg">
                    <svg
                        width="18"
                        height="18"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        id="settings"
                    >
                        <path d="M12.32 30.47a2.82 2.82 0 0 1-1.13-.23l-1.86-.77a3 3 0 0 1-1.62-3.91l.59-1.43a.33.33 0 0 0-.07-.35.33.33 0 0 0-.36-.08l-1.43.59a3 3 0 0 1-3.92-1.63l-.76-1.84a3 3 0 0 1 1.62-3.92l1.43-.59A.34.34 0 0 0 5 16a.34.34 0 0 0-.19-.32l-1.43-.58a3 3 0 0 1-1.62-3.92l.77-1.86a3 3 0 0 1 3.91-1.61l1.43.59a.33.33 0 0 0 .35-.07.33.33 0 0 0 .08-.36l-.59-1.43a3 3 0 0 1 1.63-3.92l1.84-.76a3 3 0 0 1 3.92 1.62l.59 1.43A.34.34 0 0 0 16 5a.34.34 0 0 0 .32-.19l.58-1.43a3 3 0 0 1 3.92-1.62l1.86.77a3 3 0 0 1 1.62 3.91l-.6 1.43a.33.33 0 0 0 .07.35.33.33 0 0 0 .36.08l1.43-.59a3 3 0 0 1 3.92 1.63l.76 1.84a3 3 0 0 1-1.62 3.92l-1.43.59A.34.34 0 0 0 27 16a.34.34 0 0 0 .19.32l1.43.58a3 3 0 0 1 1.62 3.92l-.77 1.86a3 3 0 0 1-3.91 1.62l-1.43-.59a.33.33 0 0 0-.35.07.33.33 0 0 0-.08.36l.59 1.43a3 3 0 0 1-1.63 3.92l-1.84.76a3 3 0 0 1-3.92-1.62l-.59-1.43A.34.34 0 0 0 16 27a.34.34 0 0 0-.32.19l-.58 1.43a3 3 0 0 1-2.78 1.85ZM8 21.67a2.35 2.35 0 0 1 2.16 3.23l-.6 1.42a1 1 0 0 0 .55 1.31l1.89.77a1 1 0 0 0 1.31-.55l.58-1.41A2.31 2.31 0 0 1 16 25a2.31 2.31 0 0 1 2.15 1.43l.59 1.42a1 1 0 0 0 1.31.54l1.85-.76a1.05 1.05 0 0 0 .54-.54 1 1 0 0 0 0-.77l-.59-1.42a2.34 2.34 0 0 1 3-3l1.42.6a1 1 0 0 0 1.31-.55l.77-1.85a1 1 0 0 0-.55-1.31l-1.41-.58a2.34 2.34 0 0 1 0-4.31l1.42-.59a1 1 0 0 0 .58-1.31l-.76-1.85a1.05 1.05 0 0 0-.54-.54 1 1 0 0 0-.77 0l-1.42.59a2.34 2.34 0 0 1-3-3.05l.6-1.42a1 1 0 0 0-.55-1.31l-1.9-.82a1 1 0 0 0-1.31.55l-.58 1.41A2.31 2.31 0 0 1 16 7a2.31 2.31 0 0 1-2.15-1.43l-.59-1.42A1 1 0 0 0 12 3.61l-1.85.76a1.05 1.05 0 0 0-.54.54 1 1 0 0 0 0 .77l.59 1.42a2.34 2.34 0 0 1-3.1 3.05l-1.42-.6a1 1 0 0 0-1.31.55L3.6 12a1 1 0 0 0 .55 1.31l1.41.58a2.34 2.34 0 0 1 0 4.31l-1.42.59a1 1 0 0 0-.54 1.31l.76 1.85a1.05 1.05 0 0 0 .54.54 1 1 0 0 0 .77 0l1.42-.59a2.32 2.32 0 0 1 .91-.23Zm8-.67a5 5 0 0 1-4.63-6.91A5 5 0 1 1 16 21Zm0-8a3.06 3.06 0 0 0-1.15.23 3 3 0 0 0-1.62 3.92 3 3 0 0 0 3.92 1.62 3 3 0 0 0 0-5.54A2.88 2.88 0 0 0 16 13Z"></path>
                    </svg>
                </div>
                <div className="account-dropdown__list__data">
                    Account Settings
                </div>
            </div>

            <div
                className="account-dropdown__list"
                onClick={() => copyAddress(data.walletAddress)}
            >
                <div className="account-dropdown__list__svg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        id="wallet"
                    >
                        <g
                            fill="none"
                            fill-rule="evenodd"
                            stroke="#200E32"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            transform="translate(2.5 3)"
                        >
                            <path d="M19.1389383,11.3957621 L15.0906357,11.3957621 C13.6041923,11.3948508 12.399362,10.1909319 12.3984507,8.70448849 C12.3984507,7.21804511 13.6041923,6.01412622 15.0906357,6.01321486 L19.1389383,6.01321486"></path>
                            <line
                                x1="15.549"
                                x2="15.237"
                                y1="8.643"
                                y2="8.643"
                            ></line>
                            <path d="M5.24766462,1.52259158e-14 L13.8910914,1.52259158e-14 C16.7892458,1.52259158e-14 19.138756,2.34951014 19.138756,5.24766462 L19.138756,12.4246981 C19.138756,15.3228526 16.7892458,17.6723627 13.8910914,17.6723627 L5.24766462,17.6723627 C2.34951014,17.6723627 1.69176842e-15,15.3228526 1.69176842e-15,12.4246981 L1.69176842e-15,5.24766462 C1.69176842e-15,2.34951014 2.34951014,1.52259158e-14 5.24766462,1.52259158e-14 Z"></path>
                            <line
                                x1="4.536"
                                x2="9.935"
                                y1="4.538"
                                y2="4.538"
                            ></line>
                        </g>
                    </svg>
                </div>
                <div className="account-dropdown__list__data">
                    {data.walletAddress.trim().slice(0, 15)}...
                </div>
            </div>

            <div
                className="account-dropdown__list account-dropdown__list--last"
                onClick={logout}
            >
                <div className="account-dropdown__list__svg">
                    <svg
                        width="18"
                        height="18"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                    >
                        <path d="M10.95 15.84h-11V.17h11v3.88h-1V1.17h-9v13.67h9v-2.83h1v3.83z" />
                        <path d="M5 8h6v1H5zM11 5.96l4.4 2.54-4.4 2.54V5.96z" />
                    </svg>
                </div>
                <div className="account-dropdown__list__data">Logout</div>
            </div>
        </div>
    );
}

export default AccountDropDown;
