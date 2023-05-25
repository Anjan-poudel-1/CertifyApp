import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { Button, Toast } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { checkLoginFormError } from "../helpers/errors";
import isEmpty from "../helpers/isEmpty";
import { userLogin } from "../apis/Public/login";
import { toast } from "react-toastify";
import { useEth } from "../contexts/EthContext";
import { reducer, actions, initialState } from "../contexts/EthContext/state";
import { useNavigate } from "react-router";

function Login() {
    const [initialLoginValues, setInitialLoginValues] = useState({
        email: "",
        password: "",
    });
    const { state, dispatch } = useEth();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("initialLoginValues", initialLoginValues);
        let _errors = checkLoginFormError(initialLoginValues);
        setErrors(_errors);

        if (isEmpty(_errors)) {
            setLoading(true);
            const controller = new AbortController();
            const walletAddress = state.accounts;
            await userLogin(
                { ...initialLoginValues, walletAddress },
                "",
                controller.signal
            )
                .then((res) => {
                    console.log(res);
                    if (res.response.ok) {
                        toast.success("Log in successful");
                        let toSaveLocal = {
                            ...res.json,
                            isLoggedIn: true,
                        };
                        localStorage.setItem(
                            "certify",
                            JSON.stringify(toSaveLocal)
                        );
                        dispatch({
                            type: actions.setUserState,
                            data: {
                                toSaveLocal,
                            },
                        });
                        navigate(0);
                    } else {
                        toast.error(res.json.message);
                        setErrors({ ...res.json.errors });
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
            return () => controller.abort();
        }
    };

    const navigate = useNavigate();

    return (
        <div className=" absolute-center-page">
            <div className="login absolute-center-page__content">
                <div className="login__header">Login</div>
                <div className="login__form">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="validationFormik03">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Email Address"
                                className="mb-2"
                            >
                                <Form.Control
                                    placeholder="name@example.com"
                                    value={initialLoginValues.email}
                                    name="email"
                                    onChange={(e) => {
                                        setInitialLoginValues({
                                            ...initialLoginValues,
                                            email: e.target.value,
                                        });
                                    }}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="validationFormik04">
                            <FloatingLabel
                                controlId="floatingPassword"
                                label="Password"
                                className="mb-2"
                            >
                                <Form.Control
                                    type={"password"}
                                    name="password"
                                    value={initialLoginValues.password}
                                    onChange={(e) => {
                                        setInitialLoginValues({
                                            ...initialLoginValues,
                                            password: e.target.value,
                                        });
                                    }}
                                    placeholder="Password"
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <div className="sign-modal__btn">
                            <button
                                className={`btn btn-primary btn-full mt-2`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </Form>
                </div>

                <div className="login__ask-verifier">
                    Are you a verifier ?{" "}
                    <Link to="/verify-certificate">Verify Certificate</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
