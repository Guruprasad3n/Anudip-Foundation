import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterBox from "../components/FilterBox";
import Loader from "../components/Loader";
import ErrorPage from "../components/ErrorPage";
import "../Styles/statepage.css";
import { FaChartBar, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
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
    if (stateName) {
      document.title = `${stateName.toUpperCase()} - Center Summary | PEARL - Anudip Foundation`;
    }
  }, [stateName]);



  useEffect(() => {
    if (stateName) {
      document.title = `${stateName.toUpperCase()} - Center Summary | PEARL - Anudip Foundation`;
    }
  }, [stateName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/state/${stateName}/centers`);
        const result = await res.json();
        if (result.success) setCenterData(result.data);
      } catch (error) {
        console.error("Error fetching center data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [stateName]);

  if (loading) return <Loader />;
  if (!loading && centerData.length === 0) {
    return <ErrorPage message={`No data available for "${stateName}"`} />;
  }

  const handleExport = (type) => {
    window.open(`${BASE_URL}/api/state/${stateName}/centers?exportType=${type}`, "_blank");
  };

  const uniqueCenterCodes = [...new Set(centerData.map((c) => c.centerCode))];

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

  const total = Object.values(centerSummary).reduce(
    (acc, c) => {
      acc.totalTarget += c.totalTarget;
      acc.enrolled += c.enrolled;
      acc.trained += c.trained;
      acc.placed += c.placed;
      return acc;
    },
    { totalTarget: 0, enrolled: 0, trained: 0, placed: 0 }
  );

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

  const doughnutData = {
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
          <FaChartBar size={22} className="chart-icon" onClick={openModal} title="View Charts" />
          <FaFileCsv size={22} className="export-icon" onClick={() => handleExport("csv")} title="Download CSV" />
          <FaFilePdf size={22} className="export-icon" onClick={() => handleExport("pdf")} title="Download PDF" />
          <Link to={`/state/${stateName}/batches`} className="switch-button">
            View Batch Wise Data
          </Link>
        </div>
        <div className="filter-box-container">
          <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
        </div>
      </div>

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
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { boxWidth: 14, font: { size: 12 } },
                      },
                      tooltip: { enabled: true, mode: "index", intersect: false },
                      datalabels: { display: false },
                    },
                    scales: {
                      x: {
                        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
                        title: { display: true, text: "Centre Code" },
                      },
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Count" },
                      },
                    },
                  }}
                />
              </div>

              <div className="chart-box doughnut-wrapper">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { font: { size: 12 } },
                      },
                      tooltip: { enabled: true },
                    },
                    layout: {
                      padding: 10,
                    },
                  }}
                />
              </div>
            </div>
            <button className="modal-close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatePage;