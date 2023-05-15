import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import TextEditor from "../../../components/TextEditor";
import { checkSubjectFormError } from "../../../helpers/errors";
import isEmpty from "../../../helpers/isEmpty";
import Accordion from "react-bootstrap/Accordion";
import { toast } from "react-toastify";
import { fetchProgramsData } from "../../../apis/Private/programs";

function Create(props) {
    const [loading, setLoading] = useState(false);

    const [programsData, setProgramsData] = useState({
        name: "",
        description: "",
        programLeader: "",
        years: [],
    });

    const [updateId, setUpdateId] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        programLeader: "",
        years: [],
    });
    const navigate = useNavigate();
    const params = useParams();

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
                            <Accordion defaultActiveKey="0">
                                {[0, 1, 2, 3].map((_data, index) => {
                                    return (
                                        <Accordion.Item eventKey={_data}>
                                            <Accordion.Header>
                                                Year #{_index + 1}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Card
                                                    style={{
                                                        padding: "20px 25px",
                                                    }}
                                                >
                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="groupedReactSelect">
                                                                <Form.Label>
                                                                    Select
                                                                    Subjects*
                                                                </Form.Label>
                                                                <div
                                                                    className={
                                                                        errors
                                                                            .years[
                                                                            index
                                                                        ] &&
                                                                        !isEmpty(
                                                                            errors
                                                                                .years[
                                                                                index
                                                                            ]
                                                                        )
                                                                            ? "BorderWarning"
                                                                            : ""
                                                                    }
                                                                >
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
                                                                                    subject
                                                                                )
                                                                            }
                                                                            onInputChange={
                                                                                _authorInputChange
                                                                            }
                                                                            defaultOptions={
                                                                                subjectsList
                                                                            }
                                                                            isMulti
                                                                            placeholder="Select Subjects"
                                                                            className="mousetrap"
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            loadOptions={
                                                                                loadItemAuthorOptions
                                                                            }
                                                                            cacheOptions={
                                                                                true
                                                                            }
                                                                            components={{
                                                                                MenuList:
                                                                                    CustomSelectMenuList,
                                                                            }}
                                                                            onMenuScrollToBottom={
                                                                                _scrollAuthorMenuToBottom
                                                                            }
                                                                        />
                                                                    </InputGroup>
                                                                </div>
                                                                <ErrorBody>
                                                                    {
                                                                        errors.authorName
                                                                    }
                                                                </ErrorBody>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Create;
