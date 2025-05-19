import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { studentsData } from "../data/data";
import FilterBox from "../components/FilterBox";
import { FaChartBar } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import "../Styles/statepage.css";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function StatePage() {
  const { stateName } = useParams();
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const stateStudents = studentsData.filter(
    (student) =>
      student["Center State"]?.toLowerCase() === stateName.toLowerCase()
  );

  const uniqueCenterCodes = [
    ...new Set(stateStudents.map((s) => s["Center Code"])),
  ];

  const filteredData =
    selectedCenters.length > 0
      ? stateStudents.filter((student) =>
          selectedCenters.includes(student["Center Code"])
        )
      : stateStudents;

  const centerSummary = {};

  filteredData.forEach((student) => {
    const centerCode = student["Center Code"];
    const centerName = student["Center Name"];
    const status = student["Student Status"]?.toLowerCase() || "";
    const finalExamMarks = student["Final Exam Marks"];

    if (!centerSummary[centerCode]) {
      centerSummary[centerCode] = {
        centerName,
        enrolled: 0,
        trained: 0,
        dropout: 0,
        placed: 0,
      };
    }

    const summary = centerSummary[centerCode];
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

  Object.values(centerSummary).forEach((center) => {
    total.enrolled += center.enrolled;
    total.trained += center.trained;
    total.dropout += center.dropout;
    total.placed += center.placed;
  });

  const barData = {
    labels: Object.keys(centerSummary),
    datasets: [
      {
        label: "Enrolled",
        data: Object.values(centerSummary).map((c) => c.enrolled),
        backgroundColor: "#007acc",
      },
      {
        label: "Trained",
        data: Object.values(centerSummary).map((c) => c.trained),
        backgroundColor: "#00c49f",
      },
      {
        label: "Placed",
        data: Object.values(centerSummary).map((c) => c.placed),
        backgroundColor: "#ffbb28",
      },
      {
        label: "Dropout",
        data: Object.values(centerSummary).map((c) => c.dropout),
        backgroundColor: "#ff8042",
      },
    ],
  };

  const pieData = {
    labels: ["Enrolled", "Trained", "Placed", "Dropout"],
    datasets: [
      {
        data: [
          total.enrolled,
          total.trained,
          total.placed,
          total.dropout,
        ],
        backgroundColor: ["#007acc", "#00c49f", "#ffbb28", "#ff8042"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="state-container">
      <h1 className="state-title">{stateName} - Center Summary</h1>

      <div className="filter-switch-wrapper">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FaChartBar
            size={22}
            className="chart-icon"
            onClick={openModal}
            title="View Charts"
          />
          <Link to={`/state/${stateName}/batches`} className="switch-button">
            View Batch Wise Data
          </Link>
        </div>

        {uniqueCenterCodes.length > 0 ? (
          <div className="filter-box-container">
            <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
          </div>
        ) : (
          <p>No center codes found for this state.</p>
        )}
      </div>

      <table className="state-table">
        <thead>
          <tr>
            <th>Center Code</th>
            <th>Center Name</th>
            <th>Enrolled</th>
            <th>Trained</th>
            <th>Dropouts</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(centerSummary).map(([code, data]) => (
            <tr key={code}>
              <td>{code}</td>
              <td>{data.centerName}</td>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>Charts - {stateName}</h2>
            <div className="charts">
              <div className="chart-wrapper">
                <Bar data={barData} />
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

export default StatePage;
