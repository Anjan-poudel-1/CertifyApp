import React, { useState, useRef, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { useNavigate, useParams } from "react-router";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

import { useEth } from "../contexts/EthContext";
import { fetchStudentData } from "../apis/Private/students";
import { fetchProgramsData } from "../apis/Private/programs";

function Home() {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const { state, dispatch } = useEth();
    const [resultData, setResultData] = useState([]);
    const userId = JSON.parse(localStorage.getItem("certify")).user;
    const [subjects, setSubjects] = useState({});
    const [certificateDetails, setCertificateDetails] = useState({});
    const [academicData, setAcademicData] = useState({
        name: "",
        enrolledYear: "",
        programLength: "",
        isGraduated: "",
        certificateId: "",
    });
    const [programDetail, setProgramDetail] = useState({});

    console.log("userData", userData);
    console.log("academicData", academicData);
    const getUserDetails = async () => {
        setLoading(true);

        const controller = new AbortController();
        let filterQuery = `/${userId.userId}`;
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

                    setCertificateDetails({ ...res.json.student.certificate });
                    setAcademicData({
                        name: res.json.student.enrolledProgram.name,
                        enrolledYear: res.json.student.enrolledYear,
                        programLength: 4,
                        isGraduated: res.json.student.isGraduated,
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

                    let currentResult = getCurrentFormattedResult(
                        res.json.student.results
                    );

                    setSubjects({ ..._tempSubjects, ...currentResult });
                    console.log(_tempSubjects);
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
    const getCurrentFormattedResult = (_data) => {
        let toReturn = {};
        let _tempData = [..._data];

        console.log("_data", _data);

        _tempData.map((res) => {
            toReturn[res.subject] = parseInt(res.marks);
        });

        return toReturn;
    };

    useEffect(() => {
        getUserDetails();
    }, []);
    const getMarks = (subjectId) => {
        return subjects[subjectId];
    };
    return (
        <div className="page container">
            <Row style={{ margin: "2rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <h5> Academic Detail </h5>
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">
                                        Program Name
                                    </div>
                                    <div className="display-data">
                                        {academicData && academicData.name}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">
                                        Enrolled Year
                                    </div>
                                    <div className="display-data">
                                        {academicData &&
                                            academicData.enrolledYear}
                                    </div>
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col md={6}>
                                    <div className="display-label">
                                        Program Length
                                    </div>
                                    <div className="display-data">
                                        {" "}
                                        {academicData &&
                                            academicData.programLength}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="display-label">
                                        Is Graduated
                                    </div>
                                    <div className="display-data">
                                        {" "}
                                        {academicData &&
                                            academicData.isGraduated.toString()}
                                    </div>
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
                            <Row>
                                <p>
                                    You can have a look at your result that has
                                    been updated. If you find any errors, or
                                    result needs to be modified, contact
                                    administration.
                                </p>
                            </Row>
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

                                                                                    <div>
                                                                                        {getMarks(
                                                                                            indisub._id
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
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
        </div>
    );
}

export default Home;
