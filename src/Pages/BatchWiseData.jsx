import { useState } from "react";
import { studentsData } from "../data/data";
import FilterBox from "../components/FilterBox";
import "../Styles/batchwisedata.css";

function BatchWiseData() {
  const [selectedCenters, setSelectedCenters] = useState([]);

  const uniqueCenterCodes = [
    ...new Set(studentsData.map((s) => s["Center Code"]))
  ];

  const filteredData =
    selectedCenters.length > 0
      ? studentsData.filter((student) =>
          selectedCenters.includes(student["Center Code"])
        )
      : studentsData;

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

  return (
    <div className="batch-container">
      <h1 className="batch-title">Batch-wise Summary</h1>

      <div className="filter-box-container">
        <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
      </div>

      <table className="batch-table" style={{zIndex:"1"}}>
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
    </div>
  );
}

export default BatchWiseData;