import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { reducer, actions, initialState } from "../contexts/EthContext/state";

import { useNavigate } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { changePassword, fetchStudentData } from "../apis/Private/students";
import { checkPasswordFormError } from "../helpers/errors";
import isEmpty from "../helpers/isEmpty";
import { useEth } from "../contexts/EthContext";

function AccountSettings() {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useEth();
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const submitForm = async () => {
        console.log("first");

        let _errors = checkPasswordFormError({ ...passwords });

        if (isEmpty(_errors)) {
            setLoading(true);
            setErrors({ new: "", current: "", confirm: "" });
            const controller = new AbortController();
            await changePassword(
                {
                    id: userId.user._id,
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                },
                "",
                controller.signal
            )
                .then((res) => {
                    console.log(res);
                    if (res && res.response.ok) {
                        toast.success("Password changed Successfully");
                        localStorage.setItem("certify", JSON.stringify({}));
                        dispatch({
                            type: actions.setUserState,
                            data: {},
                        });
                        navigate("/");
                    } else {
                        toast.error("Invalid password");
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
            return () => controller.abort();
        } else {
            setErrors(_errors);
        }
    };
    const userId = JSON.parse(localStorage.getItem("certify"));

    const getUserDetails = async () => {
        setLoading(true);

        const controller = new AbortController();
        let filterQuery = `/${userId.user.userId}`;
        await fetchStudentData(null, filterQuery, controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    setUserData(res.json);
                } else {
                }
            })
            .catch((err) => {})
            .finally(() => {
                setLoading(false);
            });

        return () => controller.abort();
    };
    useEffect(() => {
        getUserDetails();
    }, []);
    return (
        <div className="page container">
            <div className="page-header">Account Settings</div>
            <Row style={{ margin: "2rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <h5> Personal Information </h5>
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">Name</div>
                                    <div className="display-data">
                                        {userData.name}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">Email</div>
                                    <div className="display-data">
                                        {userData.email}
                                    </div>
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">User Id</div>
                                    <div className="display-data">
                                        {userData.userId}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">
                                        Wallet Address
                                    </div>
                                    <div className="display-data">
                                        {userData.walletAddress}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {userData && !userData.isAdmin && (
                <Row style={{ margin: "2rem 0" }}>
                    <Col>
                        <Card>
                            <Card.Body
                                style={{ padding: "30px" }}
                                className="input-card"
                            >
                                <h5> Academics </h5>
                                <Row>
                                    <Col md={6}>
                                        <div className="display-label">
                                            Program Name
                                        </div>
                                        <div className="display-data">
                                            Anjan Poudel
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="display-label">
                                            Enrolled Year
                                        </div>
                                        <div className="display-data">
                                            poudelanjan8@gmail.com
                                        </div>
                                    </Col>
                                </Row>

                                <br />
                                <Row>
                                    <Col md={6}>
                                        <div className="display-label">
                                            Program Length
                                        </div>
                                        <div className="display-data">4</div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="display-label">
                                            Is Graduated
                                        </div>
                                        <div className="display-data">
                                            False
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row style={{ margin: "2rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <h5> Change Password </h5>
                            <br />
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="studentName">
                                        <Form.Label>
                                            Current Password*
                                        </Form.Label>

                                        <Form.Control
                                            type={"password"}
                                            name="current"
                                            value={passwords.current}
                                            onChange={(e) => {
                                                setPasswords({
                                                    ...passwords,
                                                    current: e.target.value,
                                                });
                                            }}
                                            placeholder="Enter your current password"
                                            isInvalid={!!errors.current}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.current}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>{" "}
                            <br />
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="studentName">
                                        <Form.Label>New Password*</Form.Label>

                                        <Form.Control
                                            type={"password"}
                                            name="new"
                                            value={passwords.new}
                                            onChange={(e) => {
                                                setPasswords({
                                                    ...passwords,
                                                    new: e.target.value,
                                                });
                                            }}
                                            placeholder="Enter your new password"
                                            isInvalid={!!errors.new}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.new}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>{" "}
                            <br />
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="studentName">
                                        <Form.Label>
                                            Confirm Password*
                                        </Form.Label>

                                        <Form.Control
                                            type={"password"}
                                            name="new"
                                            value={passwords.confirm}
                                            onChange={(e) => {
                                                setPasswords({
                                                    ...passwords,
                                                    confirm: e.target.value,
                                                });
                                            }}
                                            placeholder="Confirm your password"
                                            isInvalid={!!errors.confirm}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirm}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>{" "}
                            <br />
                            <div className="bottom-card">
                                <button
                                    className={`btn btn-secondary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() =>
                                        setPasswords({
                                            new: "",
                                            confirm: "",
                                            current: "",
                                        })
                                    }
                                >
                                    Clear
                                </button>

                                <button
                                    className={`btn btn-primary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() => submitForm()}
                                >
                                    Submit
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AccountSettings;
