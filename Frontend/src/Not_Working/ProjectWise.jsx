import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaChartBar } from "react-icons/fa";
import Modal from "react-modal";
import "../Styles/ProjectWise.css";
import ProjectChartModal from "./ProjectChartModal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProjectWise = () => {
    const [projectData, setProjectData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const [projectOptions, setProjectOptions] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProjectData();
    }, []);

    const fetchProjectData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/project");
            setProjectData(res.data.data);
            setFilteredData(res.data.data);

            const uniqueProjects = res.data.data.map((proj) => ({
                label: `${proj.funderProgram} (${proj.programId})`,
                value: proj.programId
            }));
            setProjectOptions(uniqueProjects);
        } catch (error) {
            console.error("Error fetching project-wise data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectChange = (selectedOptions) => {
        setSelectedProjects(selectedOptions);
        if (selectedOptions.length === 0) {
            setFilteredData(projectData);
        } else {
            const selectedIds = selectedOptions.map((opt) => opt.value);
            const filtered = projectData.filter((proj) =>
                selectedIds.includes(proj.programId)
            );
            setFilteredData(filtered);
        }
    };

    const sortTable = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sorted = [...filteredData].sort((a, b) => {
            if (typeof a[key] === "number") {
                return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
            } else {
                return direction === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            }
        });

        setFilteredData(sorted);
    };


    const actualTotalTarget = filteredData.reduce((sum, p) => sum + (p.totalEnrollmentTarget || 0), 0);

    const chartData = {
        labels: filteredData.map((d) =>
            `${d.funderProgram.split(" ").slice(0, 4).join(" ")}${d.funderProgram.split(" ").length > 4 ? "..." : ""}`
        ),
        datasets: [
            {
                label: "Achieved Target",
                backgroundColor: "#0984e3",
                data: filteredData.map((d) =>
                    (d.q1EnrollmentAchieve || 0) +
                    (d.q2EnrollmentAchieve || 0) +
                    (d.q3EnrollmentAchieve || 0) +
                    (d.q4EnrollmentAchieve || 0)
                )
            }
        ]
    };


    const headers = [
        { label: "S.No", key: "serial" },
        { label: "Funder Program", key: "funderProgram" },
        { label: "Vertical", key: "vertical" },
        { label: "Total Enrollment Target", key: "totalEnrollmentTarget" },
        { label: "Q1 Target", key: "totalQ1Target" },
        { label: "Q1 Achieved", key: "q1EnrollmentAchieve" },
        { label: "Q2 Target", key: "totalQ2Target" },
        { label: "Q2 Achieved", key: "q2EnrollmentAchieve" },
        { label: "Q3 Target", key: "totalQ3Target" },
        { label: "Q3 Achieved", key: "q3EnrollmentAchieve" },
        { label: "Q4 Target", key: "totalQ4Target" },
        { label: "Q4 Achieved", key: "q4EnrollmentAchieve" },
    ];

    // const chartData = {
    //     labels: filteredData.map((d) =>
    //         `${d.funderProgram.split(" ").slice(0, 4).join(" ")}${d.funderProgram.split(" ").length > 4 ? "..." : ""}`
    //     ),
    //     datasets: [
    //         {
    //             label: "Total Target",
    //             backgroundColor: "#74b9ff",
    //             data: filteredData.map((d) => d.totalEnrollmentTarget),
    //         },
    //         {
    //             label: "Q1 Achieved",
    //             backgroundColor: "#55efc4",
    //             data: filteredData.map((d) => d.q1EnrollmentAchieve),
    //         },
    //         {
    //             label: "Q2 Achieved",
    //             backgroundColor: "#81ecec",
    //             data: filteredData.map((d) => d.q2EnrollmentAchieve),
    //         },
    //         {
    //             label: "Q3 Achieved",
    //             backgroundColor: "#ffeaa7",
    //             data: filteredData.map((d) => d.q3EnrollmentAchieve),
    //         },
    //         {
    //             label: "Q4 Achieved",
    //             backgroundColor: "#fab1a0",
    //             data: filteredData.map((d) => d.q4EnrollmentAchieve),
    //         },
    //     ],
    // };

    return (
        <div className="project-container">
            <div className="project-header">
                <FaChartBar className="chart-icon" onClick={() => setIsModalOpen(true)} />
                <h2 className="project-title">Project-wise Target Overview</h2>
                <div className="project-select">
                    <Select
                        isMulti
                        options={projectOptions}
                        placeholder="Filter by Project"
                        onChange={handleProjectChange}
                        value={selectedProjects}
                        isSearchable
                    />
                </div>
            </div>

            {loading ? (
                <p className="project-loading">Loading data...</p>
            ) : (
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="project-table">
                            <thead>
                                <tr>
                                    {headers.map((head) => (
                                        <th key={head.key} onClick={() => sortTable(head.key)}>
                                            {head.label} {sortConfig.key === head.key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((proj, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td title={proj.funderProgram}>
                                            {proj.funderProgram
                                                .split(" ")
                                                .slice(0, 7)
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                .join(" ")}
                                            {proj.funderProgram.split(" ").length > 7 ? "..." : ""}
                                        </td>
                                        <td>{proj.vertical}</td>
                                        <td>{proj.totalEnrollmentTarget}</td>
                                        <td>{proj.totalQ1Target}</td>
                                        <td>{proj.q1EnrollmentAchieve}</td>
                                        <td>{proj.totalQ2Target}</td>
                                        <td>{proj.q2EnrollmentAchieve}</td>
                                        <td>{proj.totalQ3Target}</td>
                                        <td>{proj.q3EnrollmentAchieve}</td>
                                        <td>{proj.totalQ4Target}</td>
                                        <td>{proj.q4EnrollmentAchieve}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ProjectChartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectOptions={projectOptions}
                selectedProjects={selectedProjects}
                handleProjectChange={handleProjectChange}
                chartData={chartData}
                actualTotalTarget={actualTotalTarget}
            />



        </div>
    );
};

export default ProjectWise;


