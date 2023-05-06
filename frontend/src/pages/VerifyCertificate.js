import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
function VerifyCertificate() {
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ hash: "" });

    const handleSubmit = () => {
        console.log("Submitting the verify certificate form");
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
                </div>
            </div>
        </div>
    );
}

export default VerifyCertificate;
