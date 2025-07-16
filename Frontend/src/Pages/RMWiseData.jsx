import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import "../Styles/RMWise.css";
import Loader from "../components/Loader";
import ErrorPage from "../components/ErrorPage"
import { ThemeContext } from "../ThemeContext";

const quarterOptions = [
  { label: "Q1", value: "1" },
  { label: "Q2", value: "2" },
  { label: "Q3", value: "3" },
  { label: "Q4", value: "4" },
];

const BASE_URL = import.meta.env.VITE_API_URL;

const RMWiseData = () => {
  const [rmData, setRmData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rmOptions, setRmOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedRMs, setSelectedRMs] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [expandedQuarters, setExpandedQuarters] = useState({});
  const [verticalOptions, setVerticalOptions] = useState([]);
  const [selectedVerticals, setSelectedVerticals] = useState([]);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchData();
    document.title = "RM-wise Target Allocation | PEARL - Anudip Foundation";
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/rm`);
      const data = res.data.data;
      setRmData(data);
      setFilteredData(data);

      const uniqueRMs = [...new Set(data.map((item) => item.rmName))];
      setRmOptions(uniqueRMs.map((rm) => ({ label: rm, value: rm })));

      const uniqueVerticals = [...new Set(data.map((item) => item.vertical))];
      setVerticalOptions(uniqueVerticals.map((v) => ({ label: v, value: v })));

      const uniqueProjects = [...new Set(data.map((item) => item.projectName))];
      setProjectOptions(uniqueProjects.map((proj) => ({ label: proj, value: proj })));
    } catch (error) {
      console.error("Error fetching RM-wise data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [selectedRMs, selectedProjects, selectedQuarters, selectedVerticals, rmData]);

  const applyFilters = () => {
    const rmValues = selectedRMs.map((r) => r.value);
    const projectValues = selectedProjects.map((p) => p.value);
    const qValues = selectedQuarters.map((q) => q.value);
    const verticalValues = selectedVerticals.map((v) => v.value);

    const filtered = rmData.filter((item) => {
      const verticalMatch = verticalValues.length === 0 || verticalValues.includes(item.vertical);
      const rmMatch = rmValues.length === 0 || rmValues.includes(item.rmName);
      const projectMatch = projectValues.length === 0 || projectValues.includes(item.projectName);
      const quarterMatch = qValues.length === 0 || qValues.some((q) => item[`Q${q} Target`] !== undefined);
      return rmMatch && projectMatch && verticalMatch && quarterMatch;
    });

    setFilteredData(filtered);
  };

  const toggleQuarter = (q) => {
    setExpandedQuarters((prev) => ({
      ...prev,
      [q]: !prev[q],
    }));
  };

  const activeQuarters = selectedQuarters.length > 0
    ? selectedQuarters.map((q) => q.value)
    : ["1", "2", "3", "4"];

  const downloadFile = async (type) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/rm?exportType=${type}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rm_data_${Date.now()}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Error downloading ${type}:`, err);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      borderColor: state.isFocused ? "#007acc" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 122, 204, 0.2)" : "none",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? theme === "dark" ? "#007acc" : "#e6f4ff"
        : isFocused
          ? theme === "dark" ? "#2a2a2a" : "#f0f8ff"
          : theme === "dark" ? "#1e1e1e" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#37474f" : "#e6f4ff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#007acc",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#007acc",
      ":hover": {
        backgroundColor: theme === "dark" ? "#555" : "#cce4f7",
        color: "#fff",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
      zIndex: 10000,
    }),
  };

  const totalRow = {
    totalTarget: filteredData.reduce((sum, item) => sum + (item.totalTarget || 0), 0),
  };
  activeQuarters.forEach((q) => {
    totalRow[`Q${q} Target`] = filteredData.reduce((sum, item) => sum + (item[`Q${q} Target`] || 0), 0);
    if (expandedQuarters[q]) {
      totalRow[`Q${q} Enrolled`] = filteredData.reduce((sum, item) => sum + (item[`Q${q} Enrolled`] || 0), 0);
      totalRow[`Q${q} Trained`] = filteredData.reduce((sum, item) => sum + (item[`Q${q} Trained`] || 0), 0);
      totalRow[`Q${q} Placed`] = filteredData.reduce((sum, item) => sum + (item[`Q${q} Placed`] || 0), 0);
    }
  });

  if (loading) return <Loader />;

  if (!loading && rmData.length === 0) {
    return <ErrorPage message="No RM-wise data available." />;
  }

  return (
    <div className="rmwise-container">
      <div className="rmwise-header">
        <h2 className="rmwise-title">RM-wise Target Allocation</h2>
        <div className="rmwise-filters-wrapper">
          <div className="rmwise-filters-grid">
            <Select isMulti options={verticalOptions} value={selectedVerticals} onChange={setSelectedVerticals} placeholder="Filter by Vertical" className="rmwise-select" styles={selectStyles} menuPortalTarget={document.body} />
            <Select isMulti options={rmOptions} value={selectedRMs} onChange={setSelectedRMs} placeholder="Filter by RM" className="rmwise-select" styles={selectStyles} menuPortalTarget={document.body} />
            <Select isMulti options={projectOptions} value={selectedProjects} onChange={setSelectedProjects} placeholder="Filter by Project" className="rmwise-select" styles={selectStyles} menuPortalTarget={document.body} />
            <Select isMulti options={quarterOptions} value={selectedQuarters} onChange={setSelectedQuarters} placeholder="Filter by Quarter" className="rmwise-select" styles={selectStyles} menuPortalTarget={document.body} />
          </div>

          <div className="rmwise-export-buttons">
            <button className="download-btn" onClick={() => downloadFile("csv")}>Export CSV</button>
            <button className="download-btn" onClick={() => downloadFile("pdf")}>Export PDF</button>
          </div>
        </div>
      </div>

      {/* <div className="table-wrapper">
        <table className="rmwise-table">
          <thead>
            <tr>
              <th>RM Name</th>
              <th>Project</th>
              <th>Program</th>
              <th>State</th>
              <th>Total Target</th>
              {activeQuarters.map((q) => (
                <React.Fragment key={q}>
                  <th onClick={() => toggleQuarter(q)} className="clickable">Q{q} Target</th>
                  {expandedQuarters[q] && (
                    <>
                      <th>Q{q} Enrolled</th>
                      <th>Q{q} Trained</th>
                      <th>Q{q} Placed</th>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.rmName}</td>
                <td>{item.projectName}</td>
                <td>{item.vertical}</td>
                <td>{item.state}</td>
                <td>{item.totalTarget}</td>
                {activeQuarters.map((q) => (
                  <React.Fragment key={q}>
                    <td onClick={() => toggleQuarter(q)} className={`clickable q${q}-cell`}>
                      {item[`Q${q} Target`] || 0}
                    </td>
                    {expandedQuarters[q] && (
                      <>
                        <td>{item[`Q${q} Enrolled`] || 0}</td>
                        <td>{item[`Q${q} Trained`] || 0}</td>
                        <td>{item[`Q${q} Placed`] || 0}</td>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="total-row">
              <td colSpan={4} style={{ fontWeight: "bold" }}>Total</td>
              <td>{totalRow.totalTarget}</td>
              {activeQuarters.map((q) => (
                <React.Fragment key={`total-q${q}`}>
                  <td>{totalRow[`Q${q} Target`] || 0}</td>
                  {expandedQuarters[q] && (
                    <>
                      <td>{totalRow[`Q${q} Enrolled`] || 0}</td>
                      <td>{totalRow[`Q${q} Trained`] || 0}</td>
                      <td>{totalRow[`Q${q} Placed`] || 0}</td>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </tfoot>
        </table>
      </div> */}
      <div className="rmwise-table-wrapper">
        <table className="rmwise-table">
          <thead>
            <tr>
              <th>RM Name</th>
              <th>Project</th>
              <th>Program</th>
              <th>State</th>
              <th>Total Target</th>
              {activeQuarters.map((q) => (
                <React.Fragment key={q}>
                  <th onClick={() => toggleQuarter(q)} className="clickable">Q{q} Target</th>
                  {expandedQuarters[q] && (
                    <>
                      <th>Q{q} Enrolled</th>
                      <th>Q{q} Trained</th>
                      <th>Q{q} Placed</th>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody className="rmwise-tbody-scroll">
            {filteredData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.rmName}</td>
                <td>{item.projectName}</td>
                <td>{item.vertical}</td>
                <td>{item.state}</td>
                <td>{item.totalTarget}</td>
                {activeQuarters.map((q) => (
                  <React.Fragment key={q}>
                    <td onClick={() => toggleQuarter(q)} className={`clickable q${q}-cell`}>
                      {item[`Q${q} Target`] || 0}
                    </td>
                    {expandedQuarters[q] && (
                      <>
                        <td>{item[`Q${q} Enrolled`] || 0}</td>
                        <td>{item[`Q${q} Trained`] || 0}</td>
                        <td>{item[`Q${q} Placed`] || 0}</td>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="total-row">
              <td colSpan={4} style={{ fontWeight: "bold" }}>Total</td>
              <td>{totalRow.totalTarget}</td>
              {activeQuarters.map((q) => (
                <React.Fragment key={`total-q${q}`}>
                  <td>{totalRow[`Q${q} Target`] || 0}</td>
                  {expandedQuarters[q] && (
                    <>
                      <td>{totalRow[`Q${q} Enrolled`] || 0}</td>
                      <td>{totalRow[`Q${q} Trained`] || 0}</td>
                      <td>{totalRow[`Q${q} Placed`] || 0}</td>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default RMWiseData;