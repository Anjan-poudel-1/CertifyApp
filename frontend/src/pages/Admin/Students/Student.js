import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import {
    reducer,
    actions,
    initialState,
} from "../../../contexts/EthContext/state";

import { useNavigate, useParams } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import {
    changePassword,
    fetchStudentData,
    updateExistingUser,
} from "../../../apis/Private/students";
import { checkPasswordFormError } from "../../../helpers/errors";
import isEmpty from "../../../helpers/isEmpty";
import { useEth } from "../../../contexts/EthContext";

function Student() {
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useEth();
    const [academicUpdate, setAcademicUpdate] = useState(false);
    const [personalInfoUpdate, setPersonalInfoUpdate] = useState(false);
    const userId = useParams();

    const submitAcademicForm = async () => {
        setLoading(true);
        const controller = new AbortController();

        let _toSendData = {
            student: {
                enrolledYear: academicData.enrolledYear,
            },
        };

        await updateExistingUser(
            _toSendData,
            `/${userData.id}`,
            controller.signal
        )
            .then((res) => {
                if (res.response.ok) {
                    toast.success("User Data Updated Successfully");
                    setAcademicData({
                        name: res.json.student.enrolledProgram.name,
                        enrolledYear: res.json.student.enrolledYear,
                        programLength: 4,
                        isGraduated: res.json.student.isGraduated,
                    });

                    setInitialAcademic({
                        name: res.json.student.enrolledProgram.name,
                        enrolledYear: res.json.student.enrolledYear,
                        programLength: 4,
                        isGraduated: res.json.student.isGraduated,
                    });

                    setAcademicUpdate(false);
                } else {
                    toast.error("Couldnot update Data");
                }
            })
            .catch((err) => {})
            .finally(() => {
                setLoading(false);
            });

        return () => controller.signal();
    };
    const submitPersonalForm = async () => {
        setLoading(true);
        const controller = new AbortController();

        let _toSendData = {
            name: userData.name,
            email: userData.email,
            walletAddress: userData.walletAddress,
        };

        await updateExistingUser(
            _toSendData,
            `/${userData.id}`,
            controller.signal
        )
            .then((res) => {
                if (res.response.ok) {
                    toast.success("User Data Updated Successfully");
                    setUserData({
                        name: res.json.name,
                        email: res.json.email,
                        walletAddress: res.json.walletAddress,
                        studentId: res.json.student.studentId,
                        id: res.json._id,
                    });

                    setInitialUserData({
                        name: res.json.name,
                        email: res.json.email,
                        walletAddress: res.json.walletAddress,
                        studentId: res.json.student.studentId,
                        id: res.json._id,
                    });

                    setPersonalInfoUpdate(false);
                } else {
                    toast.error("Couldnot update Data");
                }
            })
            .catch((err) => {})
            .finally(() => {
                setLoading(false);
            });

        return () => controller.signal();
    };

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        walletAddress: "",
        studentId: "",
        id: "",
    });

    const [initialUserData, setInitialUserData] = useState({});
    const [initialAcademic, setInitialAcademic] = useState({});

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        walletAddress: "",
        enrolledYear: "",
        isGraduated: "",
    });

    const [academicData, setAcademicData] = useState({
        name: "",
        enrolledYear: "",
        programLength: "",
        isGraduated: "",
    });
    const getUserDetails = async () => {
        setLoading(true);

        const controller = new AbortController();
        let filterQuery = `/${userId.id}`;
        await fetchStudentData(null, filterQuery, controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    setUserData({
                        name: res.json.name,
                        email: res.json.email,
                        walletAddress: res.json.walletAddress,
                        studentId: res.json.student.studentId,
                        id: res.json._id,
                    });

                    setInitialUserData({
                        name: res.json.name,
                        email: res.json.email,
                        walletAddress: res.json.walletAddress,
                        studentId: res.json.student.studentId,
                        id: res.json._id,
                    });

                    setAcademicData({
                        name: res.json.student.enrolledProgram.name,
                        enrolledYear: res.json.student.enrolledYear,
                        programLength: 4,
                        isGraduated: res.json.student.isGraduated,
                    });

                    setInitialAcademic({
                        name: res.json.student.enrolledProgram.name,
                        enrolledYear: res.json.student.enrolledYear,
                        programLength: 4,
                        isGraduated: res.json.student.isGraduated,
                    });
                } else {
                    toast.error("Unable to fetch student Data");
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
            <div className="page-header">Student</div>

            <Row style={{ margin: "2rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "1rem",
                                }}
                            >
                                <h5> Student Information </h5>
                                {!personalInfoUpdate && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() =>
                                            setPersonalInfoUpdate(true)
                                        }
                                    >
                                        {personalInfoUpdate
                                            ? "Cancel"
                                            : "Update"}
                                    </button>
                                )}
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">Name</div>
                                    {personalInfoUpdate ? (
                                        <Form.Group controlId="name">
                                            <Form.Control
                                                type={"text"}
                                                name="name"
                                                value={userData.name}
                                                onChange={(e) => {
                                                    setUserData({
                                                        ...userData,
                                                        name: e.target.value,
                                                    });
                                                }}
                                                placeholder="Enter User Name"
                                                isInvalid={!!errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    ) : (
                                        <div className="display-data">
                                            {userData.name}
                                        </div>
                                    )}
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">Email</div>

                                    {personalInfoUpdate ? (
                                        <Form.Group controlId="email">
                                            <Form.Control
                                                type={"text"}
                                                name="email"
                                                value={userData.email}
                                                onChange={(e) => {
                                                    setUserData({
                                                        ...userData,
                                                        email: e.target.value,
                                                    });
                                                }}
                                                placeholder="Enter User Name"
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    ) : (
                                        <div className="display-data">
                                            {userData.email}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">
                                        Student Id
                                    </div>
                                    <div className="display-data">
                                        {userData.studentId}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">
                                        Wallet Address
                                    </div>

                                    {personalInfoUpdate ? (
                                        <Form.Group controlId="walletAddress">
                                            <Form.Control
                                                type={"text"}
                                                name="walletAddress"
                                                value={userData.walletAddress}
                                                onChange={(e) => {
                                                    setUserData({
                                                        ...userData,
                                                        walletAddress:
                                                            e.target.value,
                                                    });
                                                }}
                                                placeholder="Enter Wallet Address"
                                                isInvalid={
                                                    !!errors.walletAddress
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.walletAddress}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    ) : (
                                        <div className="display-data">
                                            {userData.walletAddress}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            {personalInfoUpdate && (
                                <div
                                    className="bottom-card"
                                    style={{ marginTop: "2rem" }}
                                >
                                    <button
                                        className={`btn btn-secondary`}
                                        type="submit"
                                        disabled={loading}
                                        onClick={() => {
                                            setPersonalInfoUpdate(false);
                                            setUserData({ ...initialUserData });
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className={`btn btn-primary`}
                                        type="submit"
                                        disabled={loading}
                                        onClick={submitPersonalForm}
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row style={{ margin: "2rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "1rem",
                                }}
                            >
                                <h5> Academics </h5>
                                {!academicUpdate && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() =>
                                            setAcademicUpdate(!academicUpdate)
                                        }
                                    >
                                        {academicUpdate ? "Cancel" : "Update"}
                                    </button>
                                )}
                            </div>

                            <Row>
                                <Col md={6}>
                                    <div className="display-label">
                                        Program Name
                                    </div>
                                    <div className="display-data">
                                        {academicData.name}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">
                                        Enrolled Year
                                    </div>

                                    {academicUpdate ? (
                                        <Form.Group controlId="enrolledYear">
                                            <Form.Control
                                                type={"text"}
                                                name="enrolledYear"
                                                value={
                                                    academicData.enrolledYear
                                                }
                                                onChange={(e) => {
                                                    setAcademicData({
                                                        ...academicData,
                                                        enrolledYear:
                                                            e.target.value,
                                                    });
                                                }}
                                                placeholder="Enter Wallet Address"
                                                isInvalid={
                                                    !!errors.enrolledYear
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.enrolledYear}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    ) : (
                                        <div className="display-data">
                                            {academicData.enrolledYear}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">
                                        Program Length
                                    </div>
                                    <div className="display-data">
                                        {academicData.programLength}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">
                                        Is Graduated
                                    </div>
                                    <div className="display-data">
                                        {academicData.isGraduated.toString()}
                                    </div>

                                    {academicUpdate && (
                                        <div
                                            className="bottom-card"
                                            style={{ marginTop: "2rem" }}
                                        >
                                            <button
                                                className={`btn btn-secondary`}
                                                type="submit"
                                                disabled={loading}
                                                onClick={() => {
                                                    setAcademicUpdate(false);
                                                    setAcademicData({
                                                        ...initialAcademic,
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className={`btn btn-primary`}
                                                type="submit"
                                                disabled={loading}
                                                onClick={() =>
                                                    submitAcademicForm()
                                                }
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row style={{ margin: "2rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <h5> Academic Result </h5>
                            <Row></Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Student;
