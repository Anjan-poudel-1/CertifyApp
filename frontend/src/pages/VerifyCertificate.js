import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { fetchCertificateData } from "../apis/Private/certificate";
import { toast } from "react-toastify";
import isEmpty from "../helpers/isEmpty";
import { Button, Collapse } from "react-bootstrap";
import { useEth } from "../contexts/EthContext";
import BigNumber from "bignumber.js";

const IndividualMarks = (marks) => {
    console.log("Marks", marks.data.results);
    return <div className="subject-marks">Individual Marks</div>;
};

function VerifyCertificate() {
    const [hash, setHash] = useState("");
    const [studentDetails, setStudentDetails] = useState({});
    const [certificateDetails, setCertificateDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ hash: "" });
    const [isVisible, initHs] = useState(false);
    const { state, dispatch } = useEth();
    const [chainDetails, setChainDetails] = useState({});
    const [userDetails, setUserDetails] = useState({});

    const invokeCollapse = () => {
        return initHs(!isVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let certificateChainData = await state.contract.studentCertificates(
            hash.trim()
        );

        if (certificateChainData[0]) {
            const controller = new AbortController();
            await fetchCertificateData(
                null,
                `/${hash.trim()}`,
                controller.signal
            )
                .then((res) => {
                    if (res.response.ok && res.json) {
                        setCertificateDetails(res.json);

                        let studentDetails = res.json && res.json.student;

                        setUserDetails(res.json);

                        console.log("studentDetails", studentDetails);
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

            let toSave = {
                certificateId: certificateChainData[0],
                certificateImage: certificateChainData[1],
                certificateOwner: certificateChainData[2],
                tokenId: certificateChainData[3],
                generatedDate: certificateChainData[4],
            };

            console.log("toSave", toSave);
            let chainStudentId = await state.contract.studentWallets(
                toSave.certificateOwner
            );

            console.log("toSaveMore", chainStudentId);
            let toSaveMore = await state.contract.students(chainStudentId);
            let chainResultData = await state.contract.studentAcademics(
                chainStudentId
            );
            console.log("toSaveMore", toSaveMore);
            toSaveMore = {
                studentName: toSaveMore[2],
                enrolledYear: toSaveMore[3].toString(),
                firstYear: chainResultData[0].toString(),
                secondYear: chainResultData[1].toString(),
                thirdYear: chainResultData[2].toString(),
                fourthYear: chainResultData[3].toString(),
            };
            console.log("toSaveMore", toSaveMore);

            setChainDetails({ ...toSave, ...toSaveMore });
            return () => controller.abort();
        } else {
            toast.error("Couldnot find the certificate");
        }
    };

    const viewCertificate = () => {
        let url = `https://ipfs.filebase.io/ipfs/${chainDetails.certificateImage}`;
        window.open(url, "_blank");
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

                    {chainDetails && !isEmpty(chainDetails.certificateId) && (
                        <div className="verify-certificate__certificateDetails">
                            <h5>
                                Certificate Id : {chainDetails.certificateId}
                            </h5>
                            <div className="verify-certificate__certificateDetails__image">
                                <img
                                    src={`https://ipfs.filebase.io/ipfs/${chainDetails.certificateImage}`}
                                />

                                <button
                                    className="btn btn-primary"
                                    onClick={viewCertificate}
                                >
                                    View Certificate
                                </button>
                            </div>

                            {studentDetails && !isEmpty(studentDetails) && (
                                <>
                                    <div className="card verify-certificate__certificateDetails__student">
                                        <h5>Student Detail</h5>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Name :</b>{" "}
                                            <span>
                                                {" "}
                                                {chainDetails.studentName}{" "}
                                            </span>
                                        </div>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Enrolled Year :</b>{" "}
                                            <span>
                                                {chainDetails.enrolledYear}
                                            </span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Graduated Year :</b>{" "}
                                            <span>
                                                {chainDetails.generatedDate}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card verify-certificate__certificateDetails__marks">
                                        <h5>Marks Obtained</h5>
                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 1 :</b>{" "}
                                            <span>
                                                {parseFloat(
                                                    chainDetails.firstYear
                                                ) / 100}{" "}
                                                %
                                            </span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 2 :</b>{" "}
                                            <span>
                                                {parseFloat(
                                                    chainDetails.secondYear
                                                ) / 100}{" "}
                                                %
                                            </span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 3 :</b>{" "}
                                            <span>
                                                {parseFloat(
                                                    chainDetails.thirdYear
                                                ) / 100}{" "}
                                                %
                                            </span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b> Year 4 :</b>{" "}
                                            <span>
                                                {parseFloat(
                                                    chainDetails.fourthYear
                                                ) / 100}{" "}
                                                %
                                            </span>
                                        </div>

                                        <div className="verify-certificate__certificateDetails__student__label">
                                            <b>
                                                {" "}
                                                Final Percentage :{" "}
                                                {(
                                                    (parseFloat(
                                                        chainDetails.firstYear
                                                    ) /
                                                        100 +
                                                        parseFloat(
                                                            chainDetails.secondYear
                                                        ) /
                                                            100 +
                                                        parseFloat(
                                                            chainDetails.thirdYear
                                                        ) /
                                                            100 +
                                                        parseFloat(
                                                            chainDetails.firstYear
                                                        ) /
                                                            100 +
                                                        parseFloat(
                                                            chainDetails.fourthYear
                                                        ) /
                                                            100) /
                                                    4
                                                ).toFixed(2)}{" "}
                                                %
                                            </b>{" "}
                                            <span></span>
                                        </div>
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
