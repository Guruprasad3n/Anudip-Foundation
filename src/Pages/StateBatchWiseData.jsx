import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { studentsData } from "../data/data";
import FilterBox from "../components/FilterBox";
import "../Styles/batchwisedata.css";
import { FaChartBar } from "react-icons/fa";

import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function StateBatchWiseData() {
    const { stateName } = useParams();
    const [selectedCenters, setSelectedCenters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const stateStudents = studentsData.filter(
        (student) =>
            student["Center State"]?.toLowerCase() === stateName.toLowerCase()
    );

    const uniqueCenterCodes = [
        ...new Set(stateStudents.map((s) => s["Center Code"]))
    ];

    const filteredData =
        selectedCenters.length > 0
            ? stateStudents.filter((student) =>
                selectedCenters.includes(student["Center Code"])
            )
            : stateStudents;

    const batchSummary = {};

    filteredData.forEach((student) => {
        const batchCode = student["Batch Code"];
        const centerCode = student["Center Code"];
        const status = student["Student Status"]?.toLowerCase() || "";
        const finalExamMarks = student["Final Exam Marks"];

        if (!batchSummary[batchCode]) {
            batchSummary[batchCode] = {
                centerCode,
                enrolled: 0,
                trained: 0,
                dropout: 0,
                placed: 0,
            };
        }

        const summary = batchSummary[batchCode];
        summary.enrolled += 1;

        if (finalExamMarks && !isNaN(finalExamMarks)) {
            summary.trained += 1;
        }

        if (status === "dropped out" || status === "dropped") summary.dropout += 1;
        if (status === "placed") summary.placed += 1;
    });

    const total = {
        enrolled: 0,
        trained: 0,
        dropout: 0,
        placed: 0,
    };

    Object.values(batchSummary).forEach((batch) => {
        total.enrolled += batch.enrolled;
        total.trained += batch.trained;
        total.dropout += batch.dropout;
        total.placed += batch.placed;
    });

    const batchLabels = Object.keys(batchSummary);
    const enrolledData = batchLabels.map(code => batchSummary[code].enrolled);
    const placedData = batchLabels.map(code => batchSummary[code].placed);

    const barData = {
        labels: batchLabels,
        datasets: [
            {
                label: 'Enrolled',
                data: enrolledData,
                backgroundColor: '#007acc',
            },
            {
                label: 'Placed',
                data: placedData,
                backgroundColor: '#00b894',
            }
        ]
    };

    const pieData = {
        labels: ['Enrolled', 'Trained', 'Dropouts', 'Placed'],
        datasets: [{
            data: [total.enrolled, total.trained, total.dropout, total.placed],
            backgroundColor: ['#007acc', '#00cec9', '#d63031', '#2ecc71']
        }]
    };

    return (
        <div className="batch-container">
            <h1 className="batch-title">{stateName} - Batch-wise Summary</h1>

            <div className="filter-and-switch">
                <div>
                    <FaChartBar size={22} className="chart-icon" onClick={openModal} title="View Charts" />
                    <Link to={`/state/${stateName}`} className="switch-button">
                        View Center Wise Data
                    </Link>
                </div>
                <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
            </div>

            <table className="batch-table">
                <thead>
                    <tr>
                        <th>Center Code</th>
                        <th>Batch Code</th>
                        <th>Enrolled</th>
                        <th>Trained</th>
                        <th>Dropouts</th>
                        <th>Placed</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(batchSummary).map(([batchCode, data]) => (
                        <tr key={batchCode}>
                            <td>{data.centerCode}</td>
                            <td>{batchCode}</td>
                            <td>{data.enrolled}</td>
                            <td>{data.trained}</td>
                            <td>{data.dropout}</td>
                            <td>{data.placed}</td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td colSpan="2">TOTAL</td>
                        <td>{total.enrolled}</td>
                        <td>{total.trained}</td>
                        <td>{total.dropout}</td>
                        <td>{total.placed}</td>
                    </tr>
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h2>{stateName} - Batch-wise Charts</h2>
                        <div className="charts">
                            <div className="chart-wrapper">
                                <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                            </div>
                            <div className="chart-wrapper">
                                <Pie data={pieData} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StateBatchWiseData;