// import { Link, useParams } from "react-router-dom";
// import { useState } from "react";
// import { studentsData } from "../data/data";
// import FilterBox from "../components/FilterBox";
// import { FaChartBar } from "react-icons/fa";
// import { Bar, Pie } from "react-chartjs-2";
// import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
// import "../Styles/statepage.css";

// Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// function StatePage() {
//   const { stateName } = useParams();
//   const [selectedCenters, setSelectedCenters] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const openModal = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);

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

//   const centerSummary = {};

//   filteredData.forEach((student) => {
//     const centerCode = student["Center Code"];
//     const centerName = student["Center Name"];
//     const status = student["Student Status"]?.toLowerCase() || "";
//     const finalExamMarks = student["Final Exam Marks"];

//     if (!centerSummary[centerCode]) {
//       centerSummary[centerCode] = {
//         centerName,
//         enrolled: 0,
//         trained: 0,
//         dropout: 0,
//         placed: 0,
//       };
//     }

//     const summary = centerSummary[centerCode];
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

//   Object.values(centerSummary).forEach((center) => {
//     total.enrolled += center.enrolled;
//     total.trained += center.trained;
//     total.dropout += center.dropout;
//     total.placed += center.placed;
//   });

//   const barData = {
//     labels: Object.keys(centerSummary),
//     datasets: [
//       {
//         label: "Enrolled",
//         data: Object.values(centerSummary).map((c) => c.enrolled),
//         backgroundColor: "#007acc",
//       },
//       {
//         label: "Trained",
//         data: Object.values(centerSummary).map((c) => c.trained),
//         backgroundColor: "#00c49f",
//       },
//       {
//         label: "Placed",
//         data: Object.values(centerSummary).map((c) => c.placed),
//         backgroundColor: "#ffbb28",
//       },
//       {
//         label: "Dropout",
//         data: Object.values(centerSummary).map((c) => c.dropout),
//         backgroundColor: "#ff8042",
//       },
//     ],
//   };

//   const pieData = {
//     labels: ["Enrolled", "Trained", "Placed", "Dropout"],
//     datasets: [
//       {
//         data: [
//           total.enrolled,
//           total.trained,
//           total.placed,
//           total.dropout,
//         ],
//         backgroundColor: ["#007acc", "#00c49f", "#ffbb28", "#ff8042"],
//         borderColor: "#fff",
//         borderWidth: 2,
//       },
//     ],
//   };

//   return (
//     <div className="state-container">
//       <h1 className="state-title">{stateName} - Center Summary</h1>

//       <div className="filter-switch-wrapper">
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <FaChartBar
//             size={22}
//             className="chart-icon"
//             onClick={openModal}
//             title="View Charts"
//           />
//           <Link to={`/state/${stateName}/batches`} className="switch-button">
//             View Batch Wise Data
//           </Link>
//         </div>

//         {uniqueCenterCodes.length > 0 ? (
//           <div className="filter-box-container">
//             <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
//           </div>
//         ) : (
//           <p>No center codes found for this state.</p>
//         )}
//       </div>

//       <table className="state-table">
//         <thead>
//           <tr>
//             <th>Center Code</th>
//             <th>Center Name</th>
//             <th>Enrolled</th>
//             <th>Trained</th>
//             <th>Dropouts</th>
//             <th>Placed</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(centerSummary).map(([code, data]) => (
//             <tr key={code}>
//               <td>{code}</td>
//               <td>{data.centerName}</td>
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

//       {showModal && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-button" onClick={closeModal}>
//               &times;
//             </button>
//             <h2>Charts - {stateName}</h2>
//             <div className="charts">
//               <div className="chart-wrapper">
//                 <Bar data={barData} />
//               </div>
//               <div className="chart-wrapper">
//                 <Pie data={pieData} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterBox from "../components/FilterBox";
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
import "../Styles/statepage.css";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
        const res = await fetch(`http://localhost:3000/api/state/${stateName}/centers`);
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
      window.open(`http://localhost:3000/api/state/${stateName}/centers?exportType=${type}`, '_blank');
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
        <p className="loading-text">Loading center data...</p>
      ) : (
        <>
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















// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// export default StatePage;
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// // import "../Styles/StateCenterSummary.css";

// const StateCenterSummary = () => {
//   const { stateName } = useParams();
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCenters();
//   }, [stateName]);

//   const fetchCenters = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/state/${stateName}/centers`);
//       setCenters(res.data.data);
//     } catch (error) {
//       console.error("Failed to fetch centers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="state-center-summary">
//       <h2 className="summary-title">{stateName} - Center Summary</h2>

//       {loading ? (
//         <p className="loading-text">Loading centers...</p>
//       ) : centers.length === 0 ? (
//         <p className="no-data-text">No centers found for {stateName}</p>
//       ) : (
//         <div className="table-wrapper">
//           <table className="summary-table">
//             <thead>
//               <tr>
//                 <th>Center Code</th>
//                 <th>District</th>
//                 <th>Vertical</th>
//                 <th>RM Name</th>
//                 <th>Total Target</th>
//                 <th>Enrolled</th>
//                 <th>Trained</th>
//                 <th>Placed</th>
//               </tr>
//             </thead>
//             <tbody>
//               {centers.map((center, index) => (
//                 <tr key={index}>
//                   <td>{center.centerCode}</td>
//                   <td>{center.district}</td>
//                   <td>{center.verticalName}</td>
//                   <td>{center.rmName}</td>
//                   <td>{center.totalTarget}</td>
//                   <td>{center.enrolled}</td>
//                   <td>{center.trained}</td>
//                   <td>{center.placed}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StateCenterSummary;
