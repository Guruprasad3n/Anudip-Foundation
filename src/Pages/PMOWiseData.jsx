import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { saveAs } from 'file-saver';
import "../Styles/PMOWise.css";

const PMOWise = () => {
    const [pmoData, setPmoData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const [selectedFunders, setSelectedFunders] = useState([]);
    const [selectedVerticals, setSelectedVerticals] = useState([]);
    const [funderOptions, setFunderOptions] = useState([]);
    const [verticalOptions, setVerticalOptions] = useState([]);

    useEffect(() => {
        fetchPMOData();
    }, []);

    const fetchPMOData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/pmo");
            setPmoData(res.data.data);
            setFilteredData(res.data.data);

            const uniqueFunders = [...new Set(res.data.data.map(item => item.funderName))];
            setFunderOptions(uniqueFunders.map(name => ({ label: name, value: name })));

            const uniqueVerticals = [...new Set(res.data.data.map(item => item.vertical))];
            setVerticalOptions(uniqueVerticals.map(v => ({ label: v, value: v })));
        } catch (error) {
            console.error("Error fetching PMO-wise data:", error);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        applyFilters();
    }, [selectedFunders, selectedVerticals, pmoData]);

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
            const url = `http://localhost:3000/api/pmo?exportType=${type}`;
            const response = await axios.get(url, { responseType: 'blob' });
            const fileType = type === 'pdf' ? 'application/pdf' : 'text/csv';
            const fileExt = type === 'pdf' ? 'pdf' : 'csv';
            const blob = new Blob([response.data], { type: fileType });
            saveAs(blob, `pmo_report.${fileExt}`);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <div className="pmo-container">
            <div className="pmo-header">
                <h2 className="pmo-title">PMO-wise Target Overview</h2>
                <div className="pmo-controls">
                    <div className="pmo-filters">
                        <Select
                            isMulti
                            options={funderOptions}
                            value={selectedFunders}
                            onChange={setSelectedFunders}
                            placeholder="Filter by Funder Name"
                            className="pmo-select"
                        />
                        <Select
                            isMulti
                            options={verticalOptions}
                            value={selectedVerticals}
                            onChange={setSelectedVerticals}
                            placeholder="Filter by Vertical"
                            className="pmo-select"
                        />
                    </div>
                    <div className="pmo-buttons">
                        <button onClick={() => downloadReport('csv')} className="btn-download">📄 Export CSV</button>
                        <button onClick={() => downloadReport('pdf')} className="btn-download">🧾 Export PDF</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="pmo-loading">⏳ Loading data...</p>
            ) : (
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PMOWise;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import "../Styles/PMOWise.css";

// const PMOWise = () => {
//     const [pmoData, setPmoData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
//     const [selectedFunders, setSelectedFunders] = useState([]);
//     const [selectedVerticals, setSelectedVerticals] = useState([]);
//     const [funderOptions, setFunderOptions] = useState([]);
//     const [verticalOptions, setVerticalOptions] = useState([]);

//     const headers = [
//         { label: "S.No", key: "serial" },
//         { label: "Funder Name", key: "funderName" },
//         { label: "Funder Program", key: "funderProgram" },
//         { label: "Vertical", key: "vertical" },
//         { label: "Enrollment Target", key: "totalEnrollmentTarget" },
//         { label: "Trained Target", key: "totalTrainedTarget" },
//         { label: "Placement Target", key: "totalPlacementTarget" },
//     ];

//     useEffect(() => {
//         fetchPMOData();
//     }, []);

//     const fetchPMOData = async () => {
//         try {
//             const res = await axios.get("http://localhost:3000/api/pmo");
//             setPmoData(res.data.data);
//             setFilteredData(res.data.data);

//             const uniqueFunders = [...new Set(res.data.data.map(item => item.funderName))];
//             setFunderOptions(uniqueFunders.map(name => ({ label: name, value: name })));

//             const uniqueVerticals = [...new Set(res.data.data.map(item => item.vertical))];
//             setVerticalOptions(uniqueVerticals.map(v => ({ label: v, value: v })));
//         } catch (error) {
//             console.error("Error fetching PMO-wise data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const applyFilters = () => {
//         const funderValues = selectedFunders.map(opt => opt.value);
//         const verticalValues = selectedVerticals.map(opt => opt.value);

//         const filtered = pmoData.filter(item => {
//             const funderMatch = funderValues.length === 0 || funderValues.includes(item.funderName);
//             const verticalMatch = verticalValues.length === 0 || verticalValues.includes(item.vertical);
//             return funderMatch && verticalMatch;
//         });

//         setFilteredData(filtered);
//     };

//     useEffect(() => {
//         applyFilters();
//     }, [selectedFunders, selectedVerticals, pmoData]);

//     const sortTable = (key) => {
//         let direction = "asc";
//         if (sortConfig.key === key && sortConfig.direction === "asc") {
//             direction = "desc";
//         }
//         setSortConfig({ key, direction });

//         const sorted = [...filteredData].sort((a, b) => {
//             if (typeof a[key] === "number") {
//                 return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
//             } else {
//                 return direction === "asc"
//                     ? (a[key] || "").localeCompare(b[key] || "")
//                     : (b[key] || "").localeCompare(a[key] || "");
//             }
//         });

//         setFilteredData(sorted);
//     };

//     return (
//         <div className="pmo-container">
//             {/* <h2 className="pmo-title">PMO-wise Target Overview</h2>

//             <div className="pmo-filters">
//                 <Select
//                     isMulti
//                     options={funderOptions}
//                     value={selectedFunders}
//                     onChange={setSelectedFunders}
//                     placeholder="Filter by Funder Name"
//                     className="pmo-select"
//                 />
//                 <Select
//                     isMulti
//                     options={verticalOptions}
//                     value={selectedVerticals}
//                     onChange={setSelectedVerticals}
//                     placeholder="Filter by Vertical"
//                     className="pmo-select"
//                 />
//             </div> */}
//             <div className="pmo-header">
//                 <h2 className="pmo-title">PMO-wise Target Overview</h2>
//                 <div className="pmo-filters">
//                     <Select
//                         isMulti
//                         options={funderOptions}
//                         value={selectedFunders}
//                         onChange={setSelectedFunders}
//                         placeholder="Filter by Funder Name"
//                         className="pmo-select"
//                     />
//                     <Select
//                         isMulti
//                         options={verticalOptions}
//                         value={selectedVerticals}
//                         onChange={setSelectedVerticals}
//                         placeholder="Filter by Vertical"
//                         className="pmo-select"
//                     />
//                 </div>
//             </div>


//             {loading ? (
//                 <p className="pmo-loading">Loading data...</p>
//             ) : (
//                 <div className="table-wrapper">
//                     <div className="table-scroll">
//                         <table className="pmo-table">
//                             <thead>
//                                 <tr>
//                                     {headers.map((head) => (
//                                         <th key={head.key} onClick={() => sortTable(head.key)}>
//                                             {head.label}{" "}
//                                             {sortConfig.key === head.key
//                                                 ? sortConfig.direction === "asc"
//                                                     ? "▲"
//                                                     : "▼"
//                                                 : ""}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredData.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{index + 1}</td>
//                                         <td>{item.funderName}</td>
//                                         <td>{item.funderProgram}</td>
//                                         <td>{item.vertical}</td>
//                                         <td>{item.totalEnrollmentTarget}</td>
//                                         <td>{item.totalTrainedTarget}</td>
//                                         <td>{item.totalPlacementTarget}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PMOWise;