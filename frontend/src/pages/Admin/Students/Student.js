import React, { useState, useRef, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { useNavigate, useParams } from "react-router";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import {
    changePassword,
    fetchStudentData,
    updateExistingUser,
} from "../../../apis/Private/students";
import isEmpty from "../../../helpers/isEmpty";
import { useEth } from "../../../contexts/EthContext";
import { fetchProgramsData } from "../../../apis/Private/programs";

import {
    fetchStudentResult,
    updateStudentResult,
} from "../../../apis/Private/results";
import { createStudentResult } from "../../../apis/Private/results";
import CertificateComponent from "./CertificateComponent";
import certificateTemplate from "../../../assets/images/certificate template.png";
function Student() {
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useEth();
    const [resultData, setResultData] = useState([]);
    const [subjects, setSubjects] = useState({});
    const [programDetail, setProgramDetail] = useState({});
    const [academicUpdate, setAcademicUpdate] = useState(false);
    const [personalInfoUpdate, setPersonalInfoUpdate] = useState(false);
    const userId = useParams();
    const canvasRef = useRef(null);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        walletAddress: "",
        studentId: "",
        id: "",
    });

    const [ipfsurl, setIpfsurl] = useState("");

    const [initialUserData, setInitialUserData] = useState({});
    const [initialAcademic, setInitialAcademic] = useState({});

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        walletAddress: "",
        enrolledYear: "",
        isGraduated: "",
    });

    const [hasCompletedAll, setHasCompletedAll] = useState(false);

    const [yearToUpdate, setYearToUpdate] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
    });

    const [academicData, setAcademicData] = useState({
        name: "",
        enrolledYear: "",
        programLength: "",
        isGraduated: "",
    });

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

    const getUserDetails = async () => {
        setLoading(true);

        const controller = new AbortController();
        let filterQuery = `/${userId.id}`;
        await fetchStudentData(null, filterQuery, controller.signal)
            .then(async (res) => {
                if (res.response.ok) {
                    setUserData({
                        name: res.json.name,
                        email: res.json.email,
                        walletAddress: res.json.walletAddress,
                        studentId: res.json.student.studentId,
                        id: res.json._id,
                        studentOriginalId: res.json.student._id,
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
                        programId: res.json.student.enrolledProgram._id,
                    });

                    let programId = res.json.student.enrolledProgram._id;
                    let _tempSubjects = {};
                    await fetchProgramsData(null, `/${programId}`).then(
                        (resp) => {
                            if (resp.response.ok) {
                                setProgramDetail(resp.json);

                                let _tempData = { ...resp.json };

                                _tempData.years.map((yearDetail) => {
                                    yearDetail.subjects.map((sub) => {
                                        _tempSubjects = {
                                            ..._tempSubjects,
                                            [sub._id]: 0,
                                        };
                                    });
                                });
                            }
                        }
                    );
                    getResultsDetails(res.json.student._id, _tempSubjects);
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

    const getResultsDetails = async (id, _tempSubjects) => {
        const controller = new AbortController();
        await fetchStudentResult({ id: id }, "", controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    setResultData(res.json);
                    let _tempData = {};
                    if (res.json.data && !isEmpty(res.json.data)) {
                        res.json.data.subjects.map((resultData) => {
                            _tempData = {
                                ..._tempData,
                                [resultData.subject]: resultData.marks,
                            };
                        });
                    }

                    console.log("Here ,,,,,,", _tempData);
                    console.log("Here ,,,,,,", {
                        ..._tempSubjects,
                        ..._tempData,
                    });

                    setSubjects({ ..._tempSubjects, ..._tempData });
                }
            })
            .catch((err) => {});

        return () => controller.abort();
    };

    const checkIfHasCompleted = () => {
        let toReturn = false;

        if (subjects && !isEmpty(subjects)) {
            toReturn = true;
            Object.keys(subjects).map((_key) => {
                if (parseInt(subjects[_key]) <= 0) {
                    toReturn = false;
                }
            });
        }

        return toReturn;
    };

    const toUpdateYear = (year) => {
        setYearToUpdate({
            ...yearToUpdate,
            [year]: !yearToUpdate[year],
        });
    };
    useEffect(() => {
        getUserDetails();
    }, []);

    const getMarks = (subjectId) => {
        return subjects[subjectId];
    };

    const getFormattedSubjectData = () => {
        let _tempSubjects = { ...subjects };
        let toReturn = [];
        _tempSubjects &&
            Object.keys(_tempSubjects).map((_key, index) => {
                let _obj = {
                    subject: _key,
                    marks: _tempSubjects[_key],
                };

                toReturn.push(_obj);
            });

        return { subjects: toReturn };
    };

    const resultSubmitted = async (year) => {
        console.log("Year is ", year);
        console.log(programDetail);
        let yearSeparatedProgram = [...programDetail.years];
        yearSeparatedProgram = yearSeparatedProgram[year].subjects;

        let yearSeperatedMarks = {};

        yearSeparatedProgram.map((sep, index) => {
            yearSeperatedMarks[sep._id] = subjects[sep._id];
        });
        console.log("Year separated marks", yearSeperatedMarks);
        console.log("Percentage", calculatePercentage(yearSeperatedMarks));

        console.log(subjects);
        console.log("Previous results", resultData.data);

        const controller = new AbortController();

        let _toSendSubjects = getFormattedSubjectData();

        console.log("To send subjects", _toSendSubjects);
        if (isEmpty(resultData.data)) {
            // We have a post request....
            await createStudentResult(
                { id: userData.studentOriginalId, ..._toSendSubjects },
                "",
                controller.signal
            )
                .then((res) => {
                    if (res.response.ok) {
                        getUserDetails();
                        toast.success("Result Updated");
                        setYearToUpdate({
                            0: false,
                            1: false,
                            2: false,
                            3: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            let resultId = resultData.data._id;
            await updateStudentResult({
                resultId,
                studentId: userData.studentOriginalId,
                ..._toSendSubjects,
            })
                .then((res) => {
                    if (res.response.ok) {
                        getUserDetails();
                        toast.success("Result Updated");
                        setYearToUpdate({
                            0: false,
                            1: false,
                            2: false,
                            3: false,
                        });
                    } else {
                        toast.error("Couldnot update Student Result");
                    }
                })
                .catch((err) => {});

            // We have put request to the id...
            // await updateStudentResult({
            //     studentId: userData.studentOriginalId,
            // });
        }
        return () => controller.abort();
    };

    const calculatePercentage = (marks) => {
        let totalPercent = 0;
        Object.keys(marks).map((sub) => {
            totalPercent = totalPercent + parseInt(marks[sub]);
        });

        return parseInt(totalPercent / Object.keys(marks).length).toFixed(2);
    };

    const saveCertificate = () => {};

    const downloadCertificate = () => {
        // Load the certificate template
        const certificate = new Image();
        certificate.onload = () => {
            // Create a canvas element
            const canvas = document.createElement("canvas");
            canvas.width = certificate.width;
            canvas.height = certificate.height;
            const ctx = canvas.getContext("2d");

            // Draw the template onto the canvas
            ctx.drawImage(certificate, 0, 0);

            ctx.font = "bold 34px serif";
            ctx.fillText(academicData.enrolledYear, 1035, 1065);

            ctx.font = " 32px serif";
            ctx.fillText(calculatePercentage(subjects), 1305, 935);

            const boxWidth = 1300; // Width of the rectangular box
            const boxHeight = 80; // Height of the rectangular box
            const boxX = 320; // X-coordinate of the top-left corner of the rectangular box
            const boxY = 755; // Y-coordinate of the top-left corner of the rectangular box

            // ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

            ctx.font = "62px serif";
            const text = userData.name;
            const textWidth = ctx.measureText(text).width;
            const textX = boxX + (boxWidth - textWidth) / 2;

            // Draw the dynamic text centered within the rectangular box
            ctx.fillText(text, textX, boxY + boxHeight / 2);

            const boxWidth2 = 550; // Width of the rectangular box
            const boxHeight2 = 50; // Height of the rectangular box
            const boxX2 = 360; // X-coordinate of the top-left corner of the rectangular box
            const boxY2 = 910; // Y-coordinate of the top-left corner of the rectangular box

            ctx.font = " 36px serif";
            const text2 = academicData.name;
            const textWidth2 = ctx.measureText(text2).width;
            const textX2 = boxX2 + (boxWidth2 - textWidth2) / 2;
            ctx.fillText(text2, textX2, boxY2 + boxHeight2 / 2);

            // Download the certificate
            const link = document.createElement("a");
            link.download = `${userData.name}_certificate.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        certificate.src = certificateTemplate;
    };

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
                            <h5>
                                {" "}
                                Academic Result{" "}
                                {programDetail &&
                                    programDetail.name &&
                                    `(${programDetail.name})`}{" "}
                            </h5>
                            <Row>
                                <div>
                                    {programDetail &&
                                        programDetail.years &&
                                        programDetail.years.map(
                                            (programData, index) => {
                                                return (
                                                    <Accordion
                                                        style={{
                                                            margin: "1rem 0",
                                                        }}
                                                    >
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                Year #
                                                                {index + 1}
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <div
                                                                    style={{
                                                                        textAlign:
                                                                            "end",
                                                                    }}
                                                                >
                                                                    {!yearToUpdate[
                                                                        index
                                                                    ] && (
                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() =>
                                                                                toUpdateYear(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Update
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    {programData.subjects.map(
                                                                        (
                                                                            indisub,
                                                                            _index
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        alignItems:
                                                                                            "center",
                                                                                        gap: "1.5rem",
                                                                                        margin: "0.5rem 0",
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            minWidth:
                                                                                                "150px",
                                                                                            fontWeight:
                                                                                                "600",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            indisub.name
                                                                                        }{" "}
                                                                                        :
                                                                                    </div>
                                                                                    {yearToUpdate[
                                                                                        index
                                                                                    ] ? (
                                                                                        <input
                                                                                            type="number"
                                                                                            max={
                                                                                                100
                                                                                            }
                                                                                            placeholder="Enter marks"
                                                                                            value={
                                                                                                subjects[
                                                                                                    indisub
                                                                                                        ._id
                                                                                                ]
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                setSubjects(
                                                                                                    {
                                                                                                        ...subjects,
                                                                                                        [indisub._id]:
                                                                                                            e
                                                                                                                .target
                                                                                                                .value,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <div>
                                                                                            {getMarks(
                                                                                                indisub._id
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                    {yearToUpdate[
                                                                        index
                                                                    ] && (
                                                                        <div className="bottom-card">
                                                                            <div
                                                                                className="bottom-card"
                                                                                style={{
                                                                                    marginTop:
                                                                                        "2rem",
                                                                                }}
                                                                            >
                                                                                <button
                                                                                    className={`btn btn-secondary`}
                                                                                    type="submit"
                                                                                    disabled={
                                                                                        loading
                                                                                    }
                                                                                    onClick={() => {
                                                                                        setYearToUpdate(
                                                                                            {
                                                                                                ...yearToUpdate,
                                                                                                [index]:
                                                                                                    !yearToUpdate[
                                                                                                        index
                                                                                                    ],
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    Cancel
                                                                                </button>

                                                                                <button
                                                                                    className={`btn btn-primary`}
                                                                                    type="submit"
                                                                                    disabled={
                                                                                        loading
                                                                                    }
                                                                                    onClick={() =>
                                                                                        resultSubmitted(
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Submit
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                );
                                            }
                                        )}
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {userData && !isEmpty(userData) && (
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
                                    <h5> Academic Certificate </h5>
                                </div>
                                <div
                                    style={{
                                        minHeight: "100px",
                                        paddingBottom: "30px",
                                    }}
                                >
                                    {userData.isGraduated ? (
                                        <CertificateComponent />
                                    ) : checkIfHasCompleted() ? (
                                        <>
                                            Student has completed all the course
                                            work. He/she may get the
                                            certificate.
                                            <br />
                                            <br />
                                            <button
                                                className="btn btn-primary"
                                                onClick={downloadCertificate}
                                            >
                                                Download Certificate
                                            </button>
                                            <br />
                                            <br />
                                            <p>
                                                If certificate has been
                                                generated, paste the image url
                                                here.
                                            </p>
                                            <input
                                                type="text"
                                                placeholder="IPFS uploaded hash"
                                                value={ipfsurl}
                                                style={{
                                                    padding: "0.2rem 1rem",
                                                    width: "350px",
                                                }}
                                                onChange={(e) =>
                                                    setIpfsurl(e.target.value)
                                                }
                                            />
                                            <br />
                                            <br />
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={saveCertificate}
                                            >
                                                Save
                                            </button>
                                            <div id="preview"></div>
                                        </>
                                    ) : (
                                        <>
                                            Student has not completed all the
                                            modules. He/She is not eligible to
                                            get certificate
                                        </>
                                    )}
                                </div>

                                <div id="preview"> </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default Student;
