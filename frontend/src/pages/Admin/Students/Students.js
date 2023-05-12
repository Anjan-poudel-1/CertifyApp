import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { fetchStudentData } from "../../../apis/Private/students";

function Students() {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        fetchStudentData(null, "", controller.signal)
            .then((res) => {})
            .catch((err) => {})
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const ItemList = studentData.map((_data, index) => {
        return (
            <tr key={index}>
                <th scope="row">{index + 1}</th>
            </tr>
        );
    });
    return (
        <div className="page container">
            <div className="page-header">Students</div>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Student Id</th>
                                        <th>Enrolled Program</th>
                                        <th>Enrolled Year</th>
                                        <th>Is Graduated</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>{!loading && ItemList}</tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Students;
