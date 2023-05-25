import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import {
    addStudentData,
    deleteExistingStudent,
    fetchStudentData,
} from "../../../apis/Private/students";
import { useNavigate } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { fetchProgramsData } from "../../../apis/Private/programs";
import { toast } from "react-toastify";
import { checkStudentFormError } from "../../../helpers/errors";
import isEmpty from "../../../helpers/isEmpty";
import { useEth } from "../../../contexts/EthContext";

function Create() {
    const { state, dispatch } = useEth();

    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState({
        name: "",
        email: "",
        walletAddress: "",
        enrolledYear: "",
        enrolledProgram: "",
    });

    const [programs, setPrograms] = useState([]);
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        walletAddress: "",
        enrolledYear: "",
        enrolledProgram: "",
    });

    const navigate = useNavigate();

    const submitStudentForm = async () => {
        // setLoading(true);
        const controller = new AbortController();

        let _errors = checkStudentFormError(studentData);

        setErrors({ ..._errors });

        console.log("errors", _errors);

        console.log("studentData", studentData);

        if (isEmpty(_errors)) {
            console.log(state.contract);
            console.log(state.contract.changeAdmin);

            addStudentData(studentData).then(async (res) => {
                if (res.response.ok) {
                    let studentId = res.json.student.studentId;

                    await state.contract
                        .enrollStudent(
                            studentId,
                            studentData.name,
                            studentData.walletAddress,
                            parseInt(studentData.enrolledYear),
                            studentData.enrolledProgram
                        )
                        .then((res) => {
                            toast.success("Student Added Successfully");
                            navigate("/students");
                        })
                        .catch((err) => {
                            toast.error(err.reason || err.message);
                            deleteExistingStudent(null, `/${studentId}`)
                                .then((res) => {})
                                .catch((err) => {});
                        });
                } else {
                    toast.error("Could not add the student");
                }
            });
        } else {
        }

        return () => controller.abort();
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchProgramsData(null, "", controller.signal).then((res) => {
            if (res.response.ok) {
                setPrograms([...res.json]);
            } else {
                toast.error("Could not fetch Programs Data");
            }
        });
        return () => controller.abort();
    }, []);

    return (
        <div className="page container">
            <div
                className="page-header"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div className="page-header__title">Add Student</div>
            </div>
            <Row style={{ marginTop: "2rem" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="studentName">
                                        <Form.Label>Student Name*</Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="studentName"
                                            value={studentData.name}
                                            onChange={(e) => {
                                                setStudentData({
                                                    ...studentData,
                                                    name: e.target.value,
                                                });
                                            }}
                                            placeholder="Student Name"
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="walletAddress">
                                        <Form.Label>Enail Address*</Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="email"
                                            value={studentData.email}
                                            onChange={(e) => {
                                                setStudentData({
                                                    ...studentData,
                                                    email: e.target.value,
                                                });
                                            }}
                                            placeholder="Student Email Address"
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="walletAddress">
                                        <Form.Label>Wallet Address*</Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="walletAddress"
                                            value={studentData.walletAddress}
                                            onChange={(e) => {
                                                setStudentData({
                                                    ...studentData,
                                                    walletAddress:
                                                        e.target.value,
                                                });
                                            }}
                                            placeholder="Student Wallet Address"
                                            isInvalid={!!errors.walletAddress}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.walletAddress}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="enrolledYear">
                                        <Form.Label>
                                            Year of Enrollment*
                                        </Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="enrolledYear"
                                            value={studentData.enrolledYear}
                                            onChange={(e) => {
                                                setStudentData({
                                                    ...studentData,
                                                    enrolledYear:
                                                        e.target.value,
                                                });
                                            }}
                                            placeholder="Student Enrolled Year"
                                            isInvalid={!!errors.enrolledYear}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.enrolledYear}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />

                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Program Chosen*</Form.Label>
                                        <Form.Control
                                            name="enrolledProgram"
                                            value={studentData.enrolledProgram}
                                            onChange={(e) => {
                                                console.log(e.target.value);

                                                setStudentData({
                                                    ...studentData,
                                                    enrolledProgram:
                                                        e.target.value,
                                                });
                                            }}
                                            as="select"
                                            isInvalid={!!errors.enrolledProgram}
                                        >
                                            <option value="" disabled>
                                                Choose Program
                                            </option>
                                            {programs.map((_data, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={_data._id}
                                                        selected={
                                                            _data._id ==
                                                            studentData.enrolledProgram
                                                        }
                                                    >
                                                        {_data.name}
                                                    </option>
                                                );
                                            })}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.enrolledProgram}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />

                            <div className="bottom-card">
                                <button
                                    className={`btn btn-secondary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() =>
                                        setStudentData({
                                            name: "",
                                            walletAddress: "",
                                            enrolledYear: "",
                                            enrolledProgram: "",
                                            email: "",
                                        })
                                    }
                                >
                                    Clear
                                </button>

                                <button
                                    className={`btn btn-primary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() => submitStudentForm()}
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

export default Create;
