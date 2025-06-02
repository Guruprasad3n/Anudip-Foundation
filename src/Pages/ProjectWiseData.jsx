import { useState, useEffect } from "react";
import { studentsData } from "../data/data";
import FilterBox from "../components/FilterBox";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart2 } from "lucide-react";
import "../Styles/projectwisedata.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ProjectWiseData() {
  const [selectedRM, setSelectedRM] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const uniqueRMs = [
    ...new Set(studentsData.map((s) => s["RM/ SH/ ZH"]).filter(Boolean)),
  ];

  useEffect(() => {
    if (selectedRM.length > 0) {
      const relatedProjects = studentsData
        .filter((s) => selectedRM.includes(s["RM/ SH/ ZH"]))
        .map((s) => s["Funder Name"]);
      const uniqueProjects = [...new Set(relatedProjects.filter(Boolean))];
      setProjectOptions(uniqueProjects);
      setSelectedProject([]);
    } else {
      setProjectOptions([]);
      setSelectedProject([]);
    }
  }, [selectedRM]);

  const filteredStudents = studentsData.filter(
    (s) =>
      selectedRM.includes(s["RM/ SH/ ZH"]) &&
      selectedProject.includes(s["Funder Name"])
  );

  const getSummaryData = (data) => {
    const map = {};
    data.forEach((s) => {
      if (
        (selectedRM.length === 0 || selectedRM.includes(s["RM/ SH/ ZH"])) &&
        (!selectedProject.length || !selectedRM.includes(s["RM/ SH/ ZH"]))
      ) {
        const center = s["Center Code"];
        const project = s["Funder Name"];
        if (!center || !project) return;
        const key = `${center}||${project}`;
        if (!map[key]) {
          map[key] = {
            centerCode: center,
            projectName: project,
            target: "",
            achieved: 0,
          };
        }
        map[key].achieved += 1;
      }
    });
    return Object.values(map);
  };

  const summaryData = getSummaryData(studentsData);

  const chartData = {
    labels: summaryData.map((d) => `${d.centerCode} - ${d.projectName}`),
    datasets: [
      {
        label: "Achieved",
        data: summaryData.map((d) => d.achieved),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  return (
    <div className="project-container">
      <h1>Project Wise Data</h1>
      <div className="project-header">
        <button className="chart-btn" onClick={() => setShowChart(true)}>
          <BarChart2 size={24} />
        </button>
        <div className="filter-controls">
          <div className="filter-box">
            <label>Select RM:</label>
            <FilterBox options={uniqueRMs} onChange={setSelectedRM} />
          </div>
          <div className="filter-box">
            <label>Select Project:</label>
            <FilterBox options={projectOptions} onChange={setSelectedProject} />
          </div>
        </div>
      </div>

      {selectedRM.length > 0 && selectedProject.length > 0 ? (
        <table className="project-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>RM</th>
              <th>Project (Funder Name)</th>
              <th>Center Code</th>
              <th>Batch Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr key={idx}>
                <td>{student["Student Name"]}</td>
                <td>{student["RM/ SH/ ZH"]}</td>
                <td>{student["Funder Name"]}</td>
                <td>{student["Center Code"]}</td>
                <td>{student["Batch Code"]}</td>
                <td>{student["Student Status"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Center Code</th>
              <th>Project Name</th>
              <th>Target</th>
              <th>Achieved</th>
              <th>Need to be Achieved</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, idx) => {
              const needToAchieve =
                row.target !== "" ? row.achieved - Number(row.target) : "";
              return (
                <tr key={idx}>
                  <td>{row.centerCode}</td>
                  <td>{row.projectName}</td>
                  <td>{row.target}</td>
                  <td>{row.achieved}</td>
                  <td>{needToAchieve}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {showChart && (
        <div className="modal-overlay" onClick={() => setShowChart(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button className="close-btn" onClick={() => setShowChart(false)}>
              &times;
            </button>
            <h2>Project Summary Chart</h2>
            <div className="modal-filter">
              <label>Select RM for Chart:</label>
              <FilterBox options={uniqueRMs} onChange={setSelectedRM} />
            </div>
            <Bar data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectWiseData;
