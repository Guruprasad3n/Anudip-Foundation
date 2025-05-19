
import "./src/Pages/BatchWiseData"
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { studentsData } from "../data/data";
// import FilterBox from "../components/FilterBox";
// import "../Styles/batchwisedata.css";

// function BatchWiseData() {
//   const { stateName } = useParams();  // Extract the state name from URL
//   const [selectedCenters, setSelectedCenters] = useState([]);
  
//   // Filter students based on the state passed in the URL
//   const stateStudents = studentsData.filter(
//     (student) => student["Center State"]?.toLowerCase() === stateName.toLowerCase()
//   );

//   // Get unique center codes for the filtered state
//   const uniqueCenterCodes = [
//     ...new Set(stateStudents.map((s) => s["Center Code"])),
//   ];

//   // Filter data based on selected center codes
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

//   return (
//     <div className="batch-container">
//       <h1 className="batch-title">{stateName.toUpperCase()} - Batch-wise Summary</h1>

//       <div className="filter-box-container">
//         <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
//       </div>

//       <table className="batch-table" style={{ zIndex: "1" }}>
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
//     </div>
//   );
// }

// export default BatchWiseData;


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { studentsData } from "../data/data";
// import FilterBox from "../components/FilterBox";

// function StatePage() {
//   const { stateName } = useParams();
//   const [selectedCenters, setSelectedCenters] = useState([]);

//   // Step 1: Filter only students from the clicked state
//   const stateStudents = studentsData.filter(
//     (student) =>
//       student["Center State"].toLowerCase() === stateName.toLowerCase()
//   );

//   // Step 2: Extract unique center codes from only this state's students
//   const uniqueCenterCodes = [
//     ...new Set(stateStudents.map((s) => s["Center Code"])),
//   ];

//   // Step 3: Apply multi-select center code filter
//   const filteredData =
//     selectedCenters.length > 0
//       ? stateStudents.filter((student) =>
//           selectedCenters.includes(student["Center Code"])
//         )
//       : stateStudents;

//   return (
//     <div>
//       <h1>{stateName.toUpperCase()} - Students</h1>

//       {uniqueCenterCodes.length > 0 ? (
//         <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
//       ) : (
//         <p>No center codes found for this state.</p>
//       )}

//       <table
//         border="1"
//         cellPadding="8"
//         cellSpacing="0"
//         style={{ marginTop: "16px", width: "100%", borderCollapse: "collapse" }}
//       >
//         <thead>
//           <tr>
//             <th>Student ID</th>
//             <th>Student Name</th>
//             <th>Center State</th>
//             <th>Center Code</th>
//             <th>Primary Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((student, idx) => (
//             <tr key={idx}>
//               <td>{student["Student ID"]}</td>
//               <td>{student["Student Name"]}</td>
//               <td>{student["Center State"]}</td>
//               <td>{student["Center Code"]}</td>
//               <td>{student["Primary Email ID"]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default StatePage;
