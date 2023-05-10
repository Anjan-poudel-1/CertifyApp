import React from "react";
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
        title: {
            display: true,
            text: "Chart.js Bar Chart",
        },
    },
};

function Dashboard() {
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
                                1028
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
                                1028
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
                                1028
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <Row style={{ justifyContent: "space-between" }}>
                <Col md={6}>
                    <Line options={options} data={data} />
                </Col>
                <Col md={6}>
                    <Bar options={options} data={data} />
                </Col>
            </Row>

            <Row style={{ justifyContent: "space-between", marginTop: "4rem" }}>
                <Col md={4}>
                    <PolarArea data={data} />;
                </Col>
                <Col md={4}>
                    <Doughnut data={data} />;
                </Col>
                <Col md={4}>
                    <Radar data={data} />;
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
