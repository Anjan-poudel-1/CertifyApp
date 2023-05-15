import React, { useState, useEffect } from "react";
import { Row, Col, Card, InputGroup, Table, Image } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {
    checkProgramsFormError,
    checkSubjectFormError,
} from "../../../helpers/errors";

import Accordion from "react-bootstrap/Accordion";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import {
    addNewProgram,
    fetchProgramsData,
} from "../../../apis/Private/programs";
import IndividualProgram from "./IndividualProgram";
import ErrorBody from "../../../components/ErrorBody";
import { fetchSubjectData } from "../../../apis/Private/subjects";
import isEmpty from "../../../helpers/isEmpty";

function Create(props) {
    const [loading, setLoading] = useState(false);

    const [programsData, setProgramsData] = useState({
        name: "",
        description: "",
        programLeader: "",
        years: [],
    });

    const [defaultSubjectData, setDefaultSubjectData] = useState([]);

    const [subjectSearch, setSubjectSearch] = useState([]);

    const [updateId, setUpdateId] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        programLeader: "",
        years: "",
    });
    const navigate = useNavigate();
    const params = useParams();

    const loadItemAuthorOptions = async (inputText) => {
        const requestJson = {
            action: "get",
            filter: "multiple",
            filters: { name: inputText },
            start: 0,
            end: 50,
        };

        let filterQuery = "";
        if (!isEmpty(inputText)) {
            filterQuery = `?start=0&end=50&search=${inputText}`;
        }
        return fetchSubjectData(null, filterQuery)
            .then((res) => {
                // console.log(res);
                if (res.response.status) {
                    return res.json.map((itm) => ({
                        label: `${itm.name}`,
                        value: itm.id,
                    }));
                } else {
                    toast.error("Couldnot fetch data");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchInitialDatas = async (_id) => {
        const controller = new AbortController();
        await fetchProgramsData(null, `/${_id}`, controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    setProgramsData(res.json);
                } else {
                    toast.error("Unable to fetch Programs data");
                    navigate("/programs");
                }
            })
            .catch((err) => {});
        return () => controller.abort();
    };

    const fetchSubjectsData = async () => {
        let controller = new AbortController();

        await fetchSubjectData(null, "", controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    let _toSave = [];
                    res.json.map((_d, index) => {
                        _toSave.push({
                            id: _d._id,
                            label: _d.name,
                            value: _d._id,
                        });
                    });
                    setDefaultSubjectData([..._toSave]);
                } else {
                    toast.error("Couldnot fetch Subject Data");
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
        fetchSubjectsData();
    }, []);

    const _authorInputChange = (text, index) => {
        setSubjectSearch[index] = text;
    };

    const _selectSubjectChange = (subjects, index) => {
        setErrors({ ...errors, years: "" });

        let yearsChanged = [...programsData.years];
        yearsChanged[index] = subjects || [];

        console.log("yearsChanged", yearsChanged);

        setProgramsData({ ...programsData, years: yearsChanged });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        let _errors = checkProgramsFormError(programsData);

        console.log("ERRORS", _errors);

        setErrors({ ..._errors });
        if (isEmpty(_errors)) {
            setLoading(true);
            let yearsArray = [];
            [...programsData.years].map((_dat, index) => {
                let _tempArr = [];
                _dat.map((_d) => {
                    _tempArr = [..._tempArr, _d.id];
                });
                yearsArray = [...yearsArray, { subjects: _tempArr }];
            });
            let toSendJSON = {
                name: programsData.name,
                description: programsData.description,
                programLeader: programsData.programLeader,
                years: yearsArray,
            };
            const controller = new AbortController();
            await addNewProgram(toSendJSON, "", controller.signal)
                .then((res) => {
                    if (res.response.ok) {
                        navigate("/programs");
                        toast.success("New Program Added");
                    } else {
                        toast.error("Could not add program");
                    }
                })
                .catch((err) => {})
                .finally(() => {
                    setLoading(false);
                });

            return () => controller.abort();
        }
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
                <div className="page-header__title">Add Programs</div>
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
                                    <Form.Group controlId="programName">
                                        <Form.Label>Program Name*</Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="programName"
                                            value={programsData.name}
                                            onChange={(e) => {
                                                setProgramsData({
                                                    ...programsData,
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
                                        <Form.Label>Program Leader*</Form.Label>

                                        <Form.Control
                                            type={"text"}
                                            name="programLeader"
                                            value={programsData.programLeader}
                                            onChange={(e) => {
                                                setProgramsData({
                                                    ...programsData,
                                                    programLeader:
                                                        e.target.value,
                                                });
                                            }}
                                            placeholder="Enter Program Leader"
                                            isInvalid={!!errors.programLeader}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.programLeader}
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
                                            name="description"
                                            value={programsData.description}
                                            onChange={(e) =>
                                                setProgramsData({
                                                    ...programsData,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Enter the program Description"
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <br />
                                </Col>
                            </Row>

                            <h5>Add Subjects</h5>
                            <br />
                            <Accordion
                                style={{ marginBottom: "2rem" }}
                                defaultActiveKey="0"
                            >
                                {[0, 1, 2, 3].map((_data, index) => {
                                    return (
                                        <Accordion.Item eventKey={index}>
                                            <Accordion.Header>
                                                Year #{index + 1}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Card
                                                    style={{
                                                        padding: "20px 25px",
                                                    }}
                                                >
                                                    <Row>
                                                        <Col md={8}>
                                                            <Form.Group className="groupedReactSelect">
                                                                <Form.Label>
                                                                    Select
                                                                    Subjects*
                                                                </Form.Label>
                                                                <div>
                                                                    <InputGroup>
                                                                        <AsyncSelect
                                                                            value={
                                                                                isEmpty(
                                                                                    programsData
                                                                                        .years[
                                                                                        index
                                                                                    ]
                                                                                )
                                                                                    ? null
                                                                                    : programsData
                                                                                          .years[
                                                                                          index
                                                                                      ]
                                                                            }
                                                                            onChange={(
                                                                                subject
                                                                            ) =>
                                                                                _selectSubjectChange(
                                                                                    subject,
                                                                                    index
                                                                                )
                                                                            }
                                                                            onInputChange={_authorInputChange(
                                                                                index
                                                                            )}
                                                                            defaultOptions={
                                                                                defaultSubjectData
                                                                            }
                                                                            isMulti
                                                                            placeholder="Select Subjects"
                                                                            className="mousetrap w-100"
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            loadOptions={
                                                                                loadItemAuthorOptions
                                                                            }
                                                                            cacheOptions={
                                                                                true
                                                                            }
                                                                        />
                                                                    </InputGroup>
                                                                </div>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion>

                            {errors.years && (
                                <ErrorBody>{errors.years}</ErrorBody>
                            )}

                            <div className="bottom-card">
                                <button
                                    className={`btn btn-secondary`}
                                    type="submit"
                                    disabled={loading}
                                    onClick={() =>
                                        setProgramsData({
                                            name: "",
                                            description: "",
                                            programLeader: "",
                                            years: [],
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
