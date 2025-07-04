import React from "react";
import Modal from "react-modal";
import Select from "react-select";
import { Bar } from "react-chartjs-2";
import { FaTimes } from "react-icons/fa";
import "../Styles/ProjectWise.css"; // Ensure modal styles are defined here

const ProjectChartModal = ({
    isOpen,
    onClose,
    projectOptions,
    selectedProjects,
    handleProjectChange,
    chartData,
    actualTotalTarget
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            className="chart-modal"
            overlayClassName="chart-overlay"
            ariaHideApp={false}
        >
            <div className="modal-header">
                <h2 className="modal-title">
                    Actual Enrollment Target:{" "}
                    <span style={{ color: "#0984e3" }}>{actualTotalTarget}</span>
                </h2>
                <button className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="project-select" style={{ marginBottom: "20px" }}>
                <Select
                    isMulti
                    options={projectOptions}
                    placeholder="Filter by Project"
                    onChange={handleProjectChange}
                    value={selectedProjects}
                    isSearchable
                />
            </div>

            <div className="bar-container">
                <Bar data={chartData} />
            </div>
        </Modal>
    );
};

export default ProjectChartModal;


// import React from "react";
// import Modal from "react-modal";
// import Select from "react-select";
// import { Bar } from "react-chartjs-2";

// const ProjectChartModal = ({
//     isOpen,
//     onClose,
//     projectOptions,
//     selectedProjects,
//     handleProjectChange,
//     chartData,
//     filteredData
// }) => {
//     const totalTarget = filteredData.reduce((sum, proj) => sum + (proj.totalEnrollmentTarget || 0), 0);

//     const barChartData = {
//         labels: filteredData.map(proj =>
//             `${proj.funderProgram.split(" ").slice(0, 5).join(" ")}${proj.funderProgram.split(" ").length > 5 ? "..." : ""}`
//         ),
//         datasets: [
//             {
//                 label: "Total Achieved",
//                 data: filteredData.map(proj => proj.totalEnrollmentAchieved),
//                 backgroundColor: "#74b9ff"
//             }
//         ]
//     };

//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             shouldCloseOnOverlayClick={true}
//             className="chart-modal"
//             overlayClassName="chart-overlay"
//             ariaHideApp={false}
//         >
//             <div style={{ textAlign: "right" }}>
//                 <button onClick={onClose} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer" }}>
//                     ✖
//                 </button>
//             </div>

//             <h2 className="modal-title">Project-wise Achieved Overview</h2>

//             <div className="total-target-label">
//                 <strong>Total Enrollment Target:</strong> {totalTarget}
//             </div>

//             <div className="project-select">
//                 <Select
//                     isMulti
//                     options={projectOptions}
//                     placeholder="Filter by Project"
//                     onChange={handleProjectChange}
//                     value={selectedProjects}
//                     isSearchable
//                 />
//             </div>

//             <div className="bar-container">
//                 <Bar data={barChartData} />
//             </div>
//         </Modal>
//     );
// };

// export default ProjectChartModal;


// import React from "react";
// import Modal from "react-modal";
// import Select from "react-select";
// import { Bar } from "react-chartjs-2";

// const ProjectChartModal = ({
//     isOpen,
//     onClose,
//     projectOptions,
//     selectedProjects,
//     handleProjectChange,
//     chartData
// }) => {
//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             shouldCloseOnOverlayClick={true}
//             className="chart-modal"
//             overlayClassName="chart-overlay"
//             ariaHideApp={false}
//         >
//             <div style={{ textAlign: "right" }}>
//                 <button
//                     onClick={onClose}
//                     style={{
//                         fontSize: 20,
//                         border: "none",
//                         background: "none",
//                         cursor: "pointer"
//                     }}
//                 >
//                     ✖
//                 </button>
//             </div>

//             <h2 className="modal-title">Project-wise Enrollment Overview</h2>

//             <div className="project-select">
//                 <Select
//                     isMulti
//                     options={projectOptions}
//                     placeholder="Filter by Project"
//                     onChange={handleProjectChange}
//                     value={selectedProjects}
//                     isSearchable
//                 />
//             </div>

//             <div className="bar-container">
//                 <Bar data={chartData} />
//             </div>
//         </Modal>
//     );
// };

// export default ProjectChartModal;
