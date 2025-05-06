





















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
