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
        const res = await axios.get(`http://localhost:3000/api/state/${stateName}/batches`);
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
      window.open(`http://localhost:3000/api/state/${stateName}/batches?exportType=${type}`, '_blank');
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
        <p className="loading-text">Loading batch data...</p>
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












































// import { useParams, Link } from "react-router-dom";
// import { useState } from "react";
// import { studentsData } from "../data/data";
// import FilterBox from "../components/FilterBox";
// import "../Styles/batchwisedata.css";
// import { FaChartBar } from "react-icons/fa";

// import { Bar, Pie, PolarArea } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   RadialLinearScale,
//   Tooltip,
//   Legend,
//   PolarAreaController,
// } from "chart.js";

// import ChartDataLabels from "chartjs-plugin-datalabels";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
//   RadialLinearScale,
//   PolarAreaController,
//   ChartDataLabels
// );

// function StateBatchWiseData() {
//   const { stateName } = useParams();
//   const [selectedCenters, setSelectedCenters] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const stateStudents = studentsData.filter(
//     (student) =>
//       student["Center State"]?.toLowerCase() === stateName.toLowerCase()
//   );

//   const uniqueCenterCodes = [
//     ...new Set(stateStudents.map((s) => s["Center Code"])),
//   ];

//   const filteredData =
//     selectedCenters.length > 0
//       ? stateStudents.filter((student) =>
//           selectedCenters.includes(student["Center Code"])
//         )
//       : stateStudents;

//   const batchSummary = {};

//   filteredData.forEach((student) => {
//     const batchCode = student["Batch Code"];
//     const centerCode = student["Center Code"];
//     const status = student["Student Status"]?.toLowerCase() || "";
//     const finalExamMarks = student["Final Exam Marks"];

//     if (!batchSummary[batchCode]) {
//       batchSummary[batchCode] = {
//         centerCode,
//         enrolled: 0,
//         trained: 0,
//         dropout: 0,
//         placed: 0,
//       };
//     }

//     const summary = batchSummary[batchCode];
//     summary.enrolled += 1;

//     if (finalExamMarks && !isNaN(finalExamMarks)) {
//       summary.trained += 1;
//     }

//     if (status === "dropped out" || status === "dropped") summary.dropout += 1;
//     if (status === "placed") summary.placed += 1;
//   });

//   const total = {
//     enrolled: 0,
//     trained: 0,
//     dropout: 0,
//     placed: 0,
//   };

//   Object.values(batchSummary).forEach((batch) => {
//     total.enrolled += batch.enrolled;
//     total.trained += batch.trained;
//     total.dropout += batch.dropout;
//     total.placed += batch.placed;
//   });

//   const batchLabels = Object.keys(batchSummary);
//   const enrolledData = batchLabels.map((code) => batchSummary[code].enrolled);
//   const placedData = batchLabels.map((code) => batchSummary[code].placed);
//   const trainedData = batchLabels.map((code)=>batchSummary[code].trained)

//   const barData = {
//     labels: batchLabels,
//     datasets: [
//       {
//       label: "Enrolled",
//       data: enrolledData,
//       backgroundColor: "#007acc",
//     },
//     {
//       label: "Trained",
//       data: trainedData,
//       backgroundColor: "#00cec9",
//     },
//     {
//       label: "Placed",
//       data: placedData,
//       backgroundColor: "#2ecc71",
//     },
//     ],
//   };

//   const pieData = {
//     labels: ["Enrolled", "Trained", "Placed"],
//     datasets: [
//       {
//         data: [total.enrolled, total.trained, total.placed],
//         backgroundColor: ["#007acc", "#00cec9", "#2ecc71"],
//       },
//     ],
//   };

//   const polarData = {
//     labels: ["Enrolled", "Trained", "Dropouts"],
//     datasets: [
//       {
//         data: [total.enrolled, total.trained, total.dropout],
//         backgroundColor: ["#007acc", "#00cec9", "#d63031"],
//       },
//     ],
//   };

//   const barOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "top" },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             const dataset = context.dataset;
//             const value = context.raw;
//             const total = dataset.data.reduce((a, b) => a + b, 0);
//             const percentage = ((value / total) * 100).toFixed(1);
//             return `${dataset.label}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1,
//         },
//       },
//     },
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: "right" },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             const value = context.raw;
//             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//             const percentage = ((value / total) * 100).toFixed(1);
//             return `${context.label}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//   };

//   const polarOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: "right" },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             const value = context.raw;
//             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//             const percentage = ((value / total) * 100).toFixed(1);
//             return `${context.label}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div className="batch-container">
//       <h1 className="batch-title">{stateName} - Batch-wise Summary</h1>

//       <div className="filter-and-switch">
//         <div>
//           <FaChartBar
//             size={22}
//             className="chart-icon"
//             onClick={openModal}
//             title="View Charts"
//           />
//           <Link to={`/state/${stateName}`} className="switch-button">
//             View Center Wise Data
//           </Link>
//         </div>
//         <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
//       </div>

//       <table className="batch-table">
//         <thead>
//           <tr>
//             <th>Center Code</th>
//             <th>Batch Code</th>
//             <th>Enrolled</th>
//             <th>Trained</th>
//             <th>Dropouts</th>
//             <th>Placed</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(batchSummary).map(([batchCode, data]) => (
//             <tr key={batchCode}>
//               <td>{data.centerCode}</td>
//               <td>{batchCode}</td>
//               <td>{data.enrolled}</td>
//               <td>{data.trained}</td>
//               <td>{data.dropout}</td>
//               <td>{data.placed}</td>
//             </tr>
//           ))}
//           <tr className="total-row">
//             <td colSpan="2">TOTAL</td>
//             <td>{total.enrolled}</td>
//             <td>{total.trained}</td>
//             <td>{total.dropout}</td>
//             <td>{total.placed}</td>
//           </tr>
//         </tbody>
//       </table>

//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button className="close-button" onClick={closeModal}>
//               ×
//             </button>
//             <h2>{stateName} - Batch-wise Charts</h2>
//             <div className="charts">
//               <div className="chart-wrapper" style={{ height: "300px" }}>
//                 <Bar data={barData} options={barOptions} />
//               </div>
//               <div className="chart-wrapper" style={{ height: "300px" }}>
//                 <Pie data={pieData} options={pieOptions} />
//               </div>
//               <div className="chart-wrapper" style={{ height: "300px" }}>
//                 <PolarArea data={polarData} options={polarOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StateBatchWiseData;
