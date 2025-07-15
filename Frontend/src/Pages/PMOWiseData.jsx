import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { saveAs } from "file-saver";
import "../Styles/PMOWise.css";
import Loader from "../components/Loader";
import ErrorPage from "../components/ErrorPage"; // ✅ added
import { ThemeContext } from "../ThemeContext";

const BASE_URL = import.meta.env.VITE_API_URL;

const PMOWise = () => {
    const [pmoData, setPmoData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const [selectedFunders, setSelectedFunders] = useState([]);
    const [selectedVerticals, setSelectedVerticals] = useState([]);
    const [funderOptions, setFunderOptions] = useState([]);
    const [verticalOptions, setVerticalOptions] = useState([]);

    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        fetchPMOData();
    }, []);

    const fetchPMOData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/pmo`);
            const data = res.data.data;
            setPmoData(data);
            setFilteredData(data);

            const uniqueFunders = [...new Set(data.map(item => item.funderName))];
            setFunderOptions(uniqueFunders.map(name => ({ label: name, value: name })));

            const uniqueVerticals = [...new Set(data.map(item => item.vertical))];
            setVerticalOptions(uniqueVerticals.map(v => ({ label: v, value: v })));
        } catch (error) {
            console.error("Error fetching PMO-wise data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [selectedFunders, selectedVerticals, pmoData]);

    const applyFilters = () => {
        const funderValues = selectedFunders.map(opt => opt.value);
        const verticalValues = selectedVerticals.map(opt => opt.value);

        const filtered = pmoData.filter(item => {
            const funderMatch = funderValues.length === 0 || funderValues.includes(item.funderName);
            const verticalMatch = verticalValues.length === 0 || verticalValues.includes(item.vertical);
            return funderMatch && verticalMatch;
        });

        setFilteredData(filtered);
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
                    ? (a[key] || "").localeCompare(b[key] || "")
                    : (b[key] || "").localeCompare(a[key] || "");
            }
        });

        setFilteredData(sorted);
    };

    const downloadReport = async (type) => {
        try {
            const url = `${BASE_URL}/api/pmo?exportType=${type}`;
            const response = await axios.get(url, { responseType: "blob" });
            const fileType = type === "pdf" ? "application/pdf" : "text/csv";
            const fileExt = type === "pdf" ? "pdf" : "csv";
            const blob = new Blob([response.data], { type: fileType });
            saveAs(blob, `pmo_report.${fileExt}`);
        } catch (error) {
            console.error("Download failed:", error);
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
        menuPortal: base => ({
            ...base,
            zIndex: 9999,
        }),
    };

    const totalRow = {
        totalEnrollmentTarget: filteredData.reduce((sum, item) => sum + (item.totalEnrollmentTarget || 0), 0),
        totalTrainedTarget: filteredData.reduce((sum, item) => sum + (item.totalTrainedTarget || 0), 0),
        totalPlacementTarget: filteredData.reduce((sum, item) => sum + (item.totalPlacementTarget || 0), 0),
        totalEnrolled: filteredData.reduce((sum, item) => sum + (item.totalEnrolled || 0), 0),
        totalTrained: filteredData.reduce((sum, item) => sum + (item.totalTrained || 0), 0),
        totalPlaced: filteredData.reduce((sum, item) => sum + (item.totalPlaced || 0), 0),
    };

    // ✅ Loading
    if (loading) return <Loader />;

    // ❌ No Data Found
    if (!loading && pmoData.length === 0) {
        return <ErrorPage message="No PMO data available." />;
    }

    return (
        <div className="pmo-container">
            <div className="pmo-header">
                <h2 className="pmo-title">PMO-wise Target Overview</h2>

                <div className="pmo-toolbar">
                    <div className="pmo-filters">
                        <Select
                            isMulti
                            options={funderOptions}
                            value={selectedFunders}
                            onChange={setSelectedFunders}
                            placeholder="Filter by Funder Name"
                            className="pmo-select"
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                        />
                        <Select
                            isMulti
                            options={verticalOptions}
                            value={selectedVerticals}
                            onChange={setSelectedVerticals}
                            placeholder="Filter by Vertical"
                            className="pmo-select"
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                        />
                    </div>
                    <div className="pmo-buttons">
                        <button onClick={() => downloadReport("csv")} className="btn-download">📄 Export CSV</button>
                        <button onClick={() => downloadReport("pdf")} className="btn-download">🧾 Export PDF</button>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <div className="table-scroll">
                    <table className="pmo-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th onClick={() => sortTable("funderName")}>Funder Name</th>
                                <th onClick={() => sortTable("funderProgram")}>Funder Program</th>
                                <th onClick={() => sortTable("vertical")}>Vertical</th>
                                <th onClick={() => sortTable("totalEnrollmentTarget")}>Enrollment Target</th>
                                <th onClick={() => sortTable("totalTrainedTarget")}>Trained Target</th>
                                <th onClick={() => sortTable("totalPlacementTarget")}>Placement Target</th>
                                <th>Achieved Enrolled</th>
                                <th>Achieved Trained</th>
                                <th>Achieved Placed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.funderName}</td>
                                    <td>{item.funderProgram}</td>
                                    <td>{item.vertical}</td>
                                    <td>{item.totalEnrollmentTarget}</td>
                                    <td>{item.totalTrainedTarget}</td>
                                    <td>{item.totalPlacementTarget}</td>
                                    <td>{item.totalEnrolled}</td>
                                    <td>{item.totalTrained}</td>
                                    <td>{item.totalPlaced}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td colSpan={4} style={{ fontWeight: "bold" }}>Total</td>
                                <td>{totalRow.totalEnrollmentTarget}</td>
                                <td>{totalRow.totalTrainedTarget}</td>
                                <td>{totalRow.totalPlacementTarget}</td>
                                <td>{totalRow.totalEnrolled}</td>
                                <td>{totalRow.totalTrained}</td>
                                <td>{totalRow.totalPlaced}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PMOWise;




