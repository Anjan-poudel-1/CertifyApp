import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { fetchCertificateData } from "../apis/Private/certificate";
import { toast } from "react-toastify";
import isEmpty from "../helpers/isEmpty";
import { Button, Collapse } from "react-bootstrap";

const IndividualMarks = (marks) => {
    return <div className="subject-marks">Individual Marks</div>;
};

function VerifyCertificate() {
    const [hash, setHash] = useState("");
    const [studentDetails, setStudentDetails] = useState({});
    const [certificateDetails, setCertificateDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ hash: "" });
    const [isVisible, initHs] = useState(false);

    const invokeCollapse = () => {
        return initHs(!isVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const controller = new AbortController();
        await fetchCertificateData(null, `/${hash.trim()}`, controller.signal)
            .then((res) => {
                if (res.response.ok && res.json) {
                    setCertificateDetails(res.json);

                    let studentDetails = res.json && res.json.student;

                    setStudentDetails(studentDetails);
                } else {
                    toast.error(
                        "Invalid Certificate Hash. Unable to find details"
                    );
                    setStudentDetails({});
                    setCertificateDetails({});
                }
            })
            .catch((err) => {});

        return () => controller.abort();
    };
    return (
        <div className="page container">
            <div className="page-header">Verify Certificate</div>
            <div className="page-sub-header">
                This portal allows you to verify third partys certificate. You
                need to paste the certificate hash, inorder to retrieve the
                details of certificate.
            </div>

            <div className="page-content container">
                <div className="verify-certificate">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="validationFormik03">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Place Certificate Hash"
                                className="mb-2"
                            >
                                <Form.Control
                                    placeholder="Place the certificate hash here"
                                    value={hash}
                                    name="hash"
                                    onChange={(e) => {
                                        setHash(e.target.value);
                                    }}
                                    isInvalid={!!errors.hash}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.hash}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <div className="sign-modal__btn">
                            <button
                                className={`btn btn-primary btn-full mt-2`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : "Verify Certificate"}
                            </button>
                        </div>
                    </Form>

                    {certificateDetails && !isEmpty(certificateDetails) && (
                        <div className="verify-certificate__certificateDetails">
                            <h5>Certificate Id : {certificateDetails._id}</h5>
                            <div className="verify-certificate__certificateDetails__image">
                                <img src={``} />
                            </div>

                            {studentDetails && !isEmpty(studentDetails) && (
                                <>
                                    <div className="card verify-certificate__certificateDetails__student">
                                        <h5>Student Detail</h5>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Name :</b> <span></span>
                                        </div>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Enrolled Year :</b>{" "}
                                            <span></span>
                                        </div>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Enrolled Program :</b>{" "}
                                            <span></span>
                                        </div>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Graduated Year :</b>{" "}
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className="card verify-certificate__certificateDetails__marks">
                                        <h5>Marks Obtained</h5>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 1 :</b> <span></span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 2 :</b> <span></span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 3 :</b> <span></span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 4 :</b> <span></span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Final Percentage :</b>{" "}
                                            <span></span>
                                        </div>

                                        <div
                                            className="more-details"
                                            onClick={invokeCollapse}
                                        >
                                            More Details
                                        </div>
                                        <Collapse in={isVisible}>
                                            <div id="collapsePanel">
                                                <IndividualMarks
                                                    data={studentDetails}
                                                />
                                            </div>
                                        </Collapse>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyCertificate;
