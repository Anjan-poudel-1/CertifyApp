import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { fetchStudentData } from "../../../apis/Private/students";
import { useNavigate } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
function Create() {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState({
        name: "",
        email: "",
        walletAddress: "",
        enrolledYear: "",
        enrolledProgram: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        walletAddress: "",
        enrolledYear: "",
        enrolledProgram: "",
    });

    const navigate = useNavigate();

    const submitStudentForm = () => {
        setLoading(true);
    };

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
                                                setStudentData({
                                                    ...studentData,
                                                    enrolledProgram:
                                                        e.target.value,
                                                });
                                            }}
                                            as="select"
                                        >
                                            <option value="" disabled>
                                                Choose Program
                                            </option>
                                            <option value="book">Book</option>
                                            <option value="others">
                                                Others
                                            </option>
                                        </Form.Control>
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
                                        })
                                    }
                                >
                                    Clear
                                </button>

                                <button
                                    className={`btn btn-primary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() => submitStudentForm}
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
