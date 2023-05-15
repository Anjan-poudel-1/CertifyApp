import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import { fetchStudentData } from "../../../apis/Private/students";
import { useNavigate } from "react-router";
import {
    fetchSubjectData,
    updateExistingSubject,
} from "../../../apis/Private/subjects";
import { toast } from "react-toastify";
import {
    fetchProgramsData,
    updateExistingProgram,
} from "../../../apis/Private/programs";

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
        await updateExistingProgram(
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

    const ItemList = programData.map((_data, index) => {
        return (
            <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{_data.name}</td>
                <td>{_data._id}</td>
                <td>{_data.years.length}</td>
                <td>{_data.programLeader}</td>
                <td>{_data.isActive.toString()}</td>
                <td>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/programs/${_data._id}`)}
                        >
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
                        {_data.isActive ? (
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteData(_data)}
                            >
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
                        ) : (
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteData(_data)}
                            >
                                <svg
                                    id="Layer_1"
                                    data-name="Layer 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 122.88 122.88"
                                    height="17px"
                                    width="17px"
                                    style={{ fill: "green" }}
                                >
                                    <defs></defs>
                                    <title>sync</title>
                                    <path
                                        class="cls-1"
                                        d="M64.89,32.65,59.81,58.5l-5.16-7.77C43.54,55.19,37.3,62.54,36.38,73.86c-9.13-16-3.59-30.25,8-38.63L39.09,27.3l25.8,5.35ZM61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0ZM97.56,25.32a51.08,51.08,0,1,0,15,36.12,51,51,0,0,0-15-36.12ZM56.64,91.8,61.72,66l5.16,7.77C78,69.26,84.23,61.91,85.15,50.59c9.13,16,3.59,30.25-8,38.63l5.26,7.93L56.64,91.8Z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <i
                        className="feather icon-trash-2 text-c-red f-19 m-r-5"
                        style={{ cursor: "pointer" }}
                    />
                </td>
            </tr>
        );
    });

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
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Program Name</th>
                                        <th>Program Code</th>
                                        <th>Number Of Years</th>
                                        <th>Program Leader</th>
                                        <th>Is Active</th>
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

export default Programs;
