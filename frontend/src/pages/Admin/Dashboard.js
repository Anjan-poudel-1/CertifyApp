import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement,
} from "chart.js";
import { PolarArea, Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Card, Col, Row } from "react-bootstrap";

import { ReactComponent as StudentSVG } from "../../assets/svgs/students.svg";
import { ReactComponent as ModuleSVG } from "../../assets/svgs/modules.svg";
import { ReactComponent as GraduatedSVG } from "../../assets/svgs/certificate.svg";
import { fetchAllStats } from "../../apis/Private/other";
import { fetchGraphData } from "../../apis/Private/graphData";
import isEmpty from "../../helpers/isEmpty";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
);
const randomColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(143, 188, 143, 0.5)",
    "rgba(240, 248, 255, 0.5)",
    "rgba(139, 0, 0, 0.5)",
    "rgba(0, 206, 209, 0.5)",
    "rgba(220, 20, 60, 0.5)",
    "rgba(0, 191, 255, 0.5)",
    "rgba(218, 165, 32, 0.5)",
    "rgba(148, 0, 211, 0.5)",
    "rgba(245, 222, 179, 0.5)",
    "rgba(255, 240, 245, 0.5)",
    "rgba(211, 211, 211, 0.5)",
];
export const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
        {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
            ],
            borderWidth: 1,
        },
    ],
};

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
    },
};

function Dashboard() {
    const [stats, setStats] = useState({
        totalCertificates: 0,
        totalPrograms: 0,
        totalStudents: 0,
    });

    const [graphData, setGraphData] = useState([]);
    console.log("Graphdata", graphData);
    const fetchStats = async () => {
        const controller = new AbortController();

        await fetchAllStats(null, "", controller.signal)
            .then((res) => {
                setStats({
                    totalCertificates: res.json.totalCertificates,
                    totalPrograms: res.json.totalPrograms,
                    totalStudents: res.json.totalStudents,
                });
            })
            .catch((err) => {});

        return () => controller.abort();
    };

    const getGraphData = async () => {
        const controller = new AbortController();

        await fetchGraphData(null, "", controller.signal)
            .then((res) => {
                console.log("response", res);

                // {
                //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                //     datasets: [
                //         {
                //             label: "# of Votes",
                //             data: [12, 19, 3, 5, 2, 3],
                //             backgroundColor: [
                //                 "rgba(255, 99, 132, 0.5)",
                //                 "rgba(54, 162, 235, 0.5)",
                //                 "rgba(255, 206, 86, 0.5)",
                //                 "rgba(75, 192, 192, 0.5)",
                //                 "rgba(153, 102, 255, 0.5)",
                //                 "rgba(255, 159, 64, 0.5)",
                //             ],
                //             borderWidth: 1,
                //         },
                //     ],
                // }
                if (res.response.ok) {
                    let finalGraphData = [];

                    res.json.map((graph, index) => {
                        let _graphData = { labels: [], datasets: [{}] };
                        let newGraphData = {};
                        newGraphData.label = graph.name;
                        newGraphData.borderWidth = 1;
                        newGraphData.data = graph.datasets.data;
                        newGraphData.backgroundColor = [...randomColors].slice(
                            0,
                            graph.datasets.data.length
                        );

                        _graphData.labels = graph.labels;
                        _graphData.datasets[0] = newGraphData;

                        console.log("_graphData", _graphData);

                        finalGraphData.push(_graphData);
                    });

                    console.log("finalGraphData", finalGraphData);

                    setGraphData(finalGraphData);
                }
            })
            .catch((err) => {});

        return () => controller.abort();
    };

    useEffect(() => {
        fetchStats();
        getGraphData();
    }, []);
    return (
        <div className="page container">
            <div className="page-header">Dashboard</div>
            <div className="dashboard__upper">
                <Card>
                    <div className="dashboard__upper__card">
                        <div className="dashboard__upper__card__image">
                            <StudentSVG />
                        </div>
                        <div className="dashboard__upper__card__info">
                            <div className="dashboard__upper__card__info__label">
                                Students
                            </div>
                            <div className="dashboard__upper__card__info__number">
                                {stats.totalStudents}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="dashboard__upper__card">
                        <div className="dashboard__upper__card__image">
                            <ModuleSVG />
                        </div>
                        <div className="dashboard__upper__card__info">
                            <div className="dashboard__upper__card__info__label">
                                Modules
                            </div>
                            <div className="dashboard__upper__card__info__number">
                                {stats.totalPrograms}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="dashboard__upper__card">
                        <div className="dashboard__upper__card__image">
                            <GraduatedSVG />
                        </div>
                        <div className="dashboard__upper__card__info">
                            <div className="dashboard__upper__card__info__label">
                                Graduated
                            </div>
                            <div className="dashboard__upper__card__info__number">
                                {stats.totalCertificates}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            {graphData && !isEmpty(graphData) && (
                <Row style={{ justifyContent: "space-between" }}>
                    <Col md={6}>
                        <Line options={options} data={graphData[0]} />
                    </Col>
                    <Col md={6}>
                        <Bar options={options} data={graphData[2]} />
                    </Col>
                </Row>
            )}

            {graphData && !isEmpty(graphData) && (
                <Row
                    style={{
                        justifyContent: "space-between",
                        marginTop: "4rem",
                    }}
                >
                    <Col md={4}>
                        <PolarArea data={graphData[0]} />;
                    </Col>
                    <Col md={4}>
                        <Doughnut data={graphData[1]} />;
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default Dashboard;
