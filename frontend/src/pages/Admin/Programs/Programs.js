import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { fetchStudentData } from "../../../apis/Private/students";
import { useNavigate } from "react-router";
import {
    fetchSubjectData,
    updateExistingSubject,
} from "../../../apis/Private/subjects";
import { toast } from "react-toastify";
import { fetchProgramsData } from "../../../apis/Private/programs";

function Programs() {
    const [loading, setLoading] = useState(false);
    const [programData, setProgramsData] = useState([]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        fetchProgramsData(null, "", controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    let tempUsers = [...res.json];
                    setProgramsData(tempUsers);
                }
            })
            .catch((err) => {})
            .finally(() => {
                setLoading(false);
            });
        return () => controller.abort();
    }, []);
    const deleteData = async (_data) => {
        const controller = new AbortController();
        await updateExistingSubject(
            { ..._data, isActive: !_data.isActive },
            `/${_data._id}`,
            controller.signal
        )
            .then((res) => {
                if (res.response.ok) {
                    toast.success("Data Updated Successfully");
                    window.location.reload();
                } else {
                    toast.error("Couldnot Update Data");
                }
            })
            .catch((err) => {})
            .finally(() => {});
    };
    const navigate = useNavigate();

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
                <div className="page-header__title">Programs</div>
                <div>
                    <button
                        className={`btn btn-primary btn-sm`}
                        type="submit"
                        disabled={loading}
                        onClick={() => navigate("/programs/add")}
                    >
                        Add new
                    </button>
                </div>
            </div>
            <Row style={{ marginTop: "2rem" }}>
                <Col>
                    <Card>
                        <Card.Body></Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Programs;
