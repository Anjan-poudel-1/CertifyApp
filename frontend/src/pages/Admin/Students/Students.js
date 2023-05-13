import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { fetchStudentData } from "../../../apis/Private/students";
import { useNavigate } from "react-router";

function Students() {
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        fetchStudentData(null, "", controller.signal)
            .then((res) => {
                if (res.response.ok) {
                    let tempUsers = [...res.json];
                    tempUsers = tempUsers.filter((_data) => !_data.isAdmin);

                    setStudentData(tempUsers);
                }
            })
            .catch((err) => {})
            .finally(() => {
                setLoading(false);
            });
        return () => controller.abort();
    }, []);

    const navigate = useNavigate();

    const ItemList = studentData.map((_data, index) => {
        return (
            <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{_data.name}</td>
                <td>{_data.student.studentId}</td>
                <td>{_data.student.enrolledProgram}</td>
                <td>{_data.student.enrolledYear}</td>
                <td>{_data.student.isGraduated.toString()}</td>
                <td>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ cursor: "pointer" }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                enable-background="new 0 0 32 32"
                                viewBox="0 0 32 32"
                                id="edit"
                                height="16px"
                                width="16px"
                                style={{ fill: "green" }}
                            >
                                <path d="M12.82373,12.95898l-1.86279,6.21191c-0.1582,0.52832-0.01367,1.10156,0.37646,1.49121c0.28516,0.28516,0.66846,0.43945,1.06055,0.43945c0.14404,0,0.28906-0.02051,0.43066-0.06348l6.2124-1.8623c0.23779-0.07129,0.45459-0.2002,0.62988-0.37598L31.06055,7.41016C31.3418,7.12891,31.5,6.74707,31.5,6.34961s-0.1582-0.7793-0.43945-1.06055l-4.3501-4.34961c-0.58594-0.58594-1.53516-0.58594-2.12109,0L13.2002,12.3291C13.02441,12.50488,12.89551,12.7207,12.82373,12.95898z M15.58887,14.18262L25.6499,4.12109l2.22852,2.22852L17.81738,16.41113l-3.18262,0.9541L15.58887,14.18262z"></path>
                                <path d="M30,14.5c-0.82861,0-1.5,0.67188-1.5,1.5v10c0,1.37891-1.12158,2.5-2.5,2.5H6c-1.37842,0-2.5-1.12109-2.5-2.5V6c0-1.37891,1.12158-2.5,2.5-2.5h10c0.82861,0,1.5-0.67188,1.5-1.5S16.82861,0.5,16,0.5H6C2.96729,0.5,0.5,2.96777,0.5,6v20c0,3.03223,2.46729,5.5,5.5,5.5h20c3.03271,0,5.5-2.46777,5.5-5.5V16C31.5,15.17188,30.82861,14.5,30,14.5z"></path>
                            </svg>
                        </div>
                        <div style={{ cursor: "pointer" }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="delete"
                                x="0"
                                y="0"
                                version="1.1"
                                viewBox="0 0 29 29"
                                height="17px"
                                width="17px"
                                style={{ fill: "red" }}
                            >
                                <path d="M19.795 27H9.205a2.99 2.99 0 0 1-2.985-2.702L4.505 7.099A.998.998 0 0 1 5.5 6h18a1 1 0 0 1 .995 1.099L22.78 24.297A2.991 2.991 0 0 1 19.795 27zM6.604 8 8.21 24.099a.998.998 0 0 0 .995.901h10.59a.998.998 0 0 0 .995-.901L22.396 8H6.604z"></path>
                                <path d="M26 8H3a1 1 0 1 1 0-2h23a1 1 0 1 1 0 2zM14.5 23a1 1 0 0 1-1-1V11a1 1 0 1 1 2 0v11a1 1 0 0 1-1 1zM10.999 23a1 1 0 0 1-.995-.91l-1-11a1 1 0 0 1 .905-1.086 1.003 1.003 0 0 1 1.087.906l1 11a1 1 0 0 1-.997 1.09zM18.001 23a1 1 0 0 1-.997-1.09l1-11c.051-.55.531-.946 1.087-.906a1 1 0 0 1 .905 1.086l-1 11a1 1 0 0 1-.995.91z"></path>
                                <path d="M19 8h-9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-8-2h7V4h-7v2z"></path>
                            </svg>
                        </div>
                    </div>
                    <i
                        className="feather icon-trash-2 text-c-red f-19 m-r-5"
                        style={{ cursor: "pointer" }}
                        // onClick={() => _triggerDeleteModal(item.id)}
                    />
                </td>
            </tr>
        );
    });
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
                <div className="page-header__title">Students</div>
                <div>
                    <button
                        className={`btn btn-primary btn-sm`}
                        type="submit"
                        disabled={loading}
                        onClick={() => navigate("/students/add")}
                    >
                        Add new
                    </button>
                </div>
            </div>
            <Row style={{ marginTop: "2rem" }}>
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
