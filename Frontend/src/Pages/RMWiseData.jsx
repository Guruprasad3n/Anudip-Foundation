import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "../Styles/RMWise.css";
import Loader from "../components/Loader";

const quarterOptions = [
  { label: "Q1", value: "1" },
  { label: "Q2", value: "2" },
  { label: "Q3", value: "3" },
  { label: "Q4", value: "4" },
];

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://anaudip-etp.onrender.com/api/rm");
      const data = res.data.data.map((item) => ({
        ...item,
        quarterTargets: JSON.parse(item.quarterTargets),
        quarterAchievements: JSON.parse(item.quarterAchievements),
      }));
      setRmData(data);
      setFilteredData(data);

      const uniqueRMs = [...new Set(data.map((item) => item.rmName))];
      setRmOptions(uniqueRMs.map((rm) => ({ label: rm, value: rm })));

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
  }, [selectedRMs, selectedProjects, selectedQuarters, rmData]);

  const applyFilters = () => {
    const rmValues = selectedRMs.map((r) => r.value);
    const projectValues = selectedProjects.map((p) => p.value);
    const qValues = selectedQuarters.map((q) => q.value);

    const filtered = rmData.filter((item) => {
      const rmMatch = rmValues.length === 0 || rmValues.includes(item.rmName);
      const projectMatch = projectValues.length === 0 || projectValues.includes(item.projectName);
      const quarterMatch =
        qValues.length === 0 ||
        qValues.some((q) => item.quarterTargets?.[q] !== undefined);
      return rmMatch && projectMatch && quarterMatch;
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

  return (
    <div className="rmwise-container">
      <div className="rmwise-header">
        <h2 className="rmwise-title">RM-wise Target Allocation</h2>
        <div className="rmwise-filters">
          <Select isMulti options={rmOptions} value={selectedRMs} onChange={setSelectedRMs} placeholder="Filter by RM" className="rmwise-select" />
          <Select isMulti options={projectOptions} value={selectedProjects} onChange={setSelectedProjects} placeholder="Filter by Project" className="rmwise-select" />
          <Select isMulti options={quarterOptions} value={selectedQuarters} onChange={setSelectedQuarters} placeholder="Filter by Quarter" className="rmwise-select" />
        </div>
      </div>

      {loading ? (
        <Loader />
        // <p className="rmwise-loading">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="rmwise-table">
            <thead>
              <tr>
                <th>RM Name</th>
                <th>Project</th>
                <th>Program</th>
                <th>Total Target</th>
                {activeQuarters.map((q) => (
                  <React.Fragment key={q}>
                    <th onClick={() => toggleQuarter(q)} className="clickable">
                      Q{q} Target
                    </th>
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
                  <td>{item.totalTarget}</td>
                  {activeQuarters.map((q) => (
                    <React.Fragment key={q}>
                      <td className={`q${q}-cell clickable`} onClick={() => toggleQuarter(q)}>
                        {item.quarterTargets?.[q] || 0}
                      </td>
                      {expandedQuarters[q] && (
                        <>
                          <td className={`q${q}-cell etp-cell`}>
                            {item.quarterAchievements?.[q]?.enrolled || 0}

                          </td>
                          <td className={`q${q}-cell etp-cell`}>
                            {item.quarterAchievements?.[q]?.trained || 0}

                          </td>
                          <td className={`q${q}-cell etp-cell`}>
                            {item.quarterAchievements?.[q]?.placed || 0}

                          </td>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RMWiseData;