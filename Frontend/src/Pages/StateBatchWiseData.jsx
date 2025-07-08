import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import FilterBox from "../components/FilterBox";
import "../Styles/batchwisedata.css";
import { FaChartBar, FaFileCsv, FaFilePdf } from "react-icons/fa";

import { Bar, Pie, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  PolarAreaController,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import Loader from "../components/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PolarAreaController,
  ChartDataLabels
);

function StateBatchWiseData() {
  const { stateName } = useParams();
  const [batchData, setBatchData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueCenters, setUniqueCenters] = useState([]);
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://anaudip-etp.onrender.com/api/state/${stateName}/batches`);
        const data = res.data.data;
        setBatchData(data);
        setFilteredData(data);
        const centers = [...new Set(data.map(item => item.center_code))];
        setUniqueCenters(centers);
      } catch (error) {
        console.error("Error fetching batch-wise data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stateName]);

  useEffect(() => {
    if (selectedCenters.length > 0) {
      setFilteredData(batchData.filter(item => selectedCenters.includes(item.center_code)));
    } else {
      setFilteredData(batchData);
    }
  }, [selectedCenters, batchData]);

  const handleExport = async (type) => {
    try {
      window.open(`https://anaudip-etp.onrender.com/api/state/${stateName}/batches?exportType=${type}`, '_blank');
    } catch (error) {
      console.error(`Failed to export ${type}:`, error);
    }
  };

  const totals = filteredData.reduce(
    (acc, curr) => {
      acc.enrolled += curr.enrolled || 0;
      acc.trained += curr.trained || 0;
      acc.placed += curr.placed || 0;
      return acc;
    },
    { enrolled: 0, trained: 0, placed: 0 }
  );

  const barData = {
    labels: filteredData.map(item => item.batch_code),
    datasets: [
      {
        label: "Enrolled",
        data: filteredData.map(item => item.enrolled),
        backgroundColor: "#007acc",
      },
      {
        label: "Trained",
        data: filteredData.map(item => item.trained),
        backgroundColor: "#00cec9",
      },
      {
        label: "Placed",
        data: filteredData.map(item => item.placed),
        backgroundColor: "#2ecc71",
      },
    ],
  };

  const pieData = {
    labels: ["Enrolled", "Trained", "Placed"],
    datasets: [
      {
        data: [totals.enrolled, totals.trained, totals.placed],
        backgroundColor: ["#007acc", "#00cec9", "#2ecc71"],
      },
    ],
  };

  const polarData = {
    labels: ["Enrolled", "Trained", "Placed"],
    datasets: [
      {
        data: [totals.enrolled, totals.trained, totals.placed],
        backgroundColor: ["#007acc", "#00cec9", "#2ecc71"],
      },
    ],
  };


  return (
    <div className="batch-container">
      <h1 className="batch-title">{stateName} - Batch-wise Summary</h1>

      <div className="filter-and-switch">
        <div className="icon-group">
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
          <Link to={`/state/${stateName}`} className="switch-button">
            View Center Wise Data
          </Link>
        </div>
        <FilterBox options={uniqueCenters} onChange={setSelectedCenters} />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="batch-table">
            <thead>
              <tr>
                <th>Center Code</th>
                <th>Batch Code</th>
                <th>Enrolled</th>
                <th>Trained</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.center_code}</td>
                  <td>{item.batch_code}</td>
                  <td>{item.enrolled}</td>
                  <td>{item.trained}</td>
                  <td>{item.placed}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="2">TOTAL</td>
                <td>{totals.enrolled}</td>
                <td>{totals.trained}</td>
                <td>{totals.placed}</td>
              </tr>
            </tbody>
          </table>

          {isModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>×</button>
                <h2>{stateName} - Batch-wise Charts</h2>
                <div className="charts">
                  <div className="chart-wrapper" style={{ height: "300px" }}>
                    <Bar data={barData} options={{ responsive: true }} />
                  </div>
                  <div className="chart-wrapper" style={{ height: "300px" }}>
                    <Pie data={pieData} options={{ responsive: true }} />
                  </div>
                  <div className="chart-wrapper" style={{ height: "300px" }}>
                    <PolarArea data={polarData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {batchData.length === 0 && !loading && (
        <p className="no-data">No data available for {stateName}</p>
      )}
    </div>
  );
}

export default StateBatchWiseData;