import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import TextEditor from "../../../components/TextEditor";
import { checkSubjectFormError } from "../../../helpers/errors";
import isEmpty from "../../../helpers/isEmpty";
import {
    createNewSubject,
    fetchSubjectData,
    updateExistingSubject,
} from "../../../apis/Private/subjects";
import { toast } from "react-toastify";
function Create(props) {
    const [loading, setLoading] = useState(false);

    const params = useParams();

    const [subjectData, setSubjectData] = useState({
        name: "",
        description: "",
        creditHours: 0,
    });

    const [updateId, setUpdateId] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        creditHours: 0,
    });

    const navigate = useNavigate();

    const submitForm = async () => {
        console.log("Submitting");
        let _errors = checkSubjectFormError(subjectData);
        console.log(_errors);
        if (isEmpty(_errors)) {
            setErrors({});
            let _toSendData = {
                ...subjectData,
            };
            let controller = new AbortController();
            if (updateId) {
                await updateExistingSubject(
                    _toSendData,
                    `/${updateId}`,
                    controller.signal
                )
                    .then((res) => {
                        if (res.response.ok) {
                            setSubjectData({
                                name: "",
                                description: "",
                                creditHours: 0,
                            });
                            toast.success("Subject Updated Successfully");
                            navigate("/subjects");
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                    });
            } else {
                await createNewSubject(_toSendData, "", controller.signal)
                    .then((res) => {
                        if (res.response.ok) {
                            setSubjectData({
                                name: "",
                                description: "",
                                creditHours: 0,
                            });
                            toast.success("New Subject Created");
                            navigate("/subjects");
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                    });
            }

            return () => controller.abort();
            // setLoading(true);
        } else {
            setErrors({ ..._errors });
        }
    };

    // in request json
    // description: HTMLdescription ? HTMLdescription.toString() : "",

    const fetchInitialDatas = async (_id) => {
        const controller = new AbortController();
        await fetchSubjectData(null, `/${_id}`, controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    setSubjectData(res.json);
                } else {
                    toast.error("Unable to fetch subject data");
                    navigate("/subjects");
                }
            })
            .catch((err) => {});
        return () => controller.abort();
    };
    useEffect(() => {
        if (props.update) {
            setUpdateId(params.id);
            fetchInitialDatas(params.id);
        }
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
                <div className="page-header__title">Add Subject</div>
            </div>
            <Row style={{ margin: "2rem 0 6rem 0" }}>
                <Col>
                    <Card>
                        <Card.Body
                            style={{ padding: "30px" }}
                            className="input-card"
                        >
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="subjectName">
                                        <Form.Label>Subject Name*</Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="subjectName"
                                            value={subjectData.name}
                                            onChange={(e) => {
                                                setSubjectData({
                                                    ...subjectData,
                                                    name: e.target.value,
                                                });
                                            }}
                                            placeholder="Subject Name"
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="walletAddress">
                                        <Form.Label>Credit Hours*</Form.Label>

                                        <Form.Control
                                            type={"number"}
                                            name="creditHours"
                                            value={subjectData.creditHours}
                                            onChange={(e) => {
                                                setSubjectData({
                                                    ...subjectData,
                                                    creditHours: e.target.value,
                                                });
                                            }}
                                            placeholder="Subject Credit Hours"
                                            isInvalid={!!errors.creditHours}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.creditHours}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="dedscription"
                                            value={subjectData.description}
                                            onChange={(e) =>
                                                setSubjectData({
                                                    ...subjectData,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Enter the subject Description"
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <br />
                                </Col>
                            </Row>

                            <br />

                            <div className="bottom-card">
                                <button
                                    className={`btn btn-secondary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() =>
                                        setSubjectData({
                                            name: "",
                                            description: "",
                                            creditHours: 0,
                                            setHTMLdescription: "",
                                        })
                                    }
                                >
                                    Clear
                                </button>

                                <button
                                    className={`btn btn-primary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={submitForm}
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
