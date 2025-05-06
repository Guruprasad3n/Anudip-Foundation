import { useParams } from "react-router-dom";
import { useState } from "react";
import { studentsData } from "../data/data"; // Assuming you have this imported correctly
import FilterBox from "../components/FilterBox"; // Assuming FilterBox exists

function StatePage() {
  const { stateName } = useParams();
  const [selectedCenters, setSelectedCenters] = useState([]);

  // Filter students based on the state name
  const stateStudents = studentsData.filter(
    (student) =>
      student["Center State"]?.toLowerCase() === stateName.toLowerCase()
  );

  // Get unique center codes for the state
  const uniqueCenterCodes = [
    ...new Set(stateStudents.map((s) => s["Center Code"])),
  ];

  // Filter data based on selected center codes
  const filteredData =
    selectedCenters.length > 0
      ? stateStudents.filter((student) =>
          selectedCenters.includes(student["Center Code"])
        )
      : stateStudents;

  // Initialize an object to store center-wise summary
  const centerSummary = {};

  // Loop through the filtered students and generate the center-wise summary
  filteredData.forEach((student) => {
    const centerCode = student["Center Code"];
    const centerName = student["Center Name"];
    const status = student["Student Status"]?.toLowerCase() || "";
    const finalExamMarks = student["Final Exam Marks"]; // Get the final exam marks

    // If center does not exist in summary, initialize it
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

    // Count as trained if Final Exam Marks exist (not NaN, null, undefined)
    if (finalExamMarks && !isNaN(finalExamMarks)) {
      summary.trained += 1;
    }

    // Check if student is dropped out or placed
    if (status === "dropped out" || status === "dropped") summary.dropout += 1;
    if (status === "placed") summary.placed += 1;
  });

  // Calculate total summary across all centers
  const total = {
    enrolled: 0,
    trained: 0,
    dropout: 0,
    placed: 0,
  };

  // Aggregate values from center-wise summary into total
  Object.values(centerSummary).forEach((center) => {
    total.enrolled += center.enrolled;
    total.trained += center.trained;
    total.dropout += center.dropout;
    total.placed += center.placed;
  });

  return (
    <div>
      <h1>{stateName.toUpperCase()} - Center Summary</h1>

      {uniqueCenterCodes.length > 0 ? (
        <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
      ) : (
        <p>No center codes found for this state.</p>
      )}

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ marginTop: "16px", width: "100%", borderCollapse: "collapse" }}
      >
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

          <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
            <td colSpan="2">TOTAL</td>
            <td>{total.enrolled}</td>
            <td>{total.trained}</td>
            <td>{total.dropout}</td>
            <td>{total.placed}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatePage;
