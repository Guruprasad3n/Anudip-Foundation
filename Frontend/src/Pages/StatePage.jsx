import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterBox from "../components/FilterBox";
import "../Styles/statepage.css";
import { FaChartBar, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../components/Loader"
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const BASE_URL = import.meta.env.VITE_API_URL;

function StatePage() {
  const { stateName } = useParams();
  const [centerData, setCenterData] = useState([]);
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${__API_URL__}/api/state/${stateName}/centers`);
        const result = await res.json();
        if (result.success) {
          setCenterData(result.data);
        }
      } catch (error) {
        console.error("Error fetching center data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stateName]);

  const handleExport = async (type) => {
    try {
      window.open(`${__API_URL__}/api/state/${stateName}/centers?exportType=${type}`, '_blank');
    } catch (error) {
      console.error(`Failed to export ${type}:`, error);
    }
  };

  const uniqueCenterCodes = [
    ...new Set(centerData.map((c) => c.centerCode)),
  ];

  const filteredCenters =
    selectedCenters.length > 0
      ? centerData.filter((c) => selectedCenters.includes(c.centerCode))
      : centerData;

  const centerSummary = {};

  filteredCenters.forEach((c) => {
    const code = c.centerCode;

    if (!centerSummary[code]) {
      centerSummary[code] = {
        totalTarget: 0,
        enrolled: 0,
        trained: 0,
        placed: 0,
        rmName: c.rmName || "N/A",
        verticalName: c.verticalName || "N/A",
        district: c.district || "",
      };
    }

    centerSummary[code].totalTarget += parseInt(c.totalTarget || 0);
    centerSummary[code].enrolled += parseInt(c.enrolled || 0);
    centerSummary[code].trained += parseInt(c.trained || 0);
    centerSummary[code].placed += parseInt(c.placed || 0);
  });

  const total = {
    totalTarget: 0,
    enrolled: 0,
    trained: 0,
    placed: 0,
  };

  Object.values(centerSummary).forEach((center) => {
    total.totalTarget += center.totalTarget || 0;
    total.enrolled += center.enrolled || 0;
    total.trained += center.trained || 0;
    total.placed += center.placed || 0;
  });

  const barData = {
    labels: Object.keys(centerSummary),
    datasets: [
      {
        label: "Target",
        data: Object.values(centerSummary).map((c) => c.totalTarget),
        backgroundColor: "#007acc",
      },
      {
        label: "Enrolled",
        data: Object.values(centerSummary).map((c) => c.enrolled),
        backgroundColor: "#00c49f",
      },
      {
        label: "Trained",
        data: Object.values(centerSummary).map((c) => c.trained),
        backgroundColor: "#ffbb28",
      },
      {
        label: "Placed",
        data: Object.values(centerSummary).map((c) => c.placed),
        backgroundColor: "#ff8042",
      },
    ],
  };

  const pieData = {
    labels: ["Target", "Enrolled", "Trained", "Placed"],
    datasets: [
      {
        data: [
          total.totalTarget,
          total.enrolled,
          total.trained,
          total.placed,
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
        <div className="icon-export-group">
          <FaChartBar
            size={22}
            className="chart-icon"
            onClick={openModal}
            title="View Charts"
          />
          <FaFileCsv
            size={22}
            className="export-icon"
            onClick={() => handleExport("csv")}
            title="Download CSV"
          />
          <FaFilePdf
            size={22}
            className="export-icon"
            onClick={() => handleExport("pdf")}
            title="Download PDF"
          />
          <Link to={`/state/${stateName}/batches`} className="switch-button">
            View Batch Wise Data
          </Link>
        </div>

        {uniqueCenterCodes.length > 0 ? (
          <div className="filter-box-container">
            <FilterBox
              options={uniqueCenterCodes}
              onChange={setSelectedCenters}
            />
          </div>
        ) : (
          <p>No center codes found for this state.</p>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive">
            <table className="state-table">
              <thead>
                <tr>
                  <th>Center Code</th>
                  <th>District</th>
                  <th>Program Name</th>
                  <th>RM Name</th>
                  <th>Target</th>
                  <th>Enrolled</th>
                  <th>Trained</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(centerSummary).map(([code, data]) => (
                  <tr key={code}>
                    <td>{code}</td>
                    <td>{data.district}</td>
                    <td>{data.verticalName}</td>
                    <td>{data.rmName}</td>
                    <td>{data.totalTarget}</td>
                    <td>{data.enrolled}</td>
                    <td>{data.trained}</td>
                    <td>{data.placed}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="4">TOTAL</td>
                  <td>{total.totalTarget}</td>
                  <td>{total.enrolled}</td>
                  <td>{total.trained}</td>
                  <td>{total.placed}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{stateName} - Summary Charts</h3>
                <div className="charts-wrapper">
                  <div className="chart-box">
                    <Bar data={barData} options={{ responsive: true }} />
                  </div>
                  <div className="chart-box">
                    <Pie data={pieData} options={{ responsive: true }} />
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </>
      )}

      {centerData.length === 0 && !loading && (
        <p className="no-data">No data available for {stateName}</p>
      )}
    </div>
  );
}

export default StatePage;
