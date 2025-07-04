// const db = require('../config/db');

// const sendError = (res, message, err = null) => {
//   if (err) console.error(`❌ ${message}:`, err);
//   res.status(500).json({ success: false, message });
// };

// exports.getStateCenters = async (req, res) => {
//   const { state } = req.params;

//   if (!state) {
//     return res.status(400).json({ success: false, message: "State parameter is required." });
//   }

//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         gm.center_code AS centerCode,
//         gm.state,
//         gm.district,
//         SUM(gm.target) AS totalTarget,
//         COALESCE(SUM(rm.enrolled), 0) AS enrolled,
//         COALESCE(SUM(rm.trained), 0) AS trained,
//         COALESCE(SUM(rm.placed), 0) AS placed,
//         COALESCE(MAX(trg.rm_name), 'N/A') AS rmName,
//         COALESCE(pp.vertical_name, 'Unknown') AS verticalName
//       FROM planner_program_planning_gm gm
//       LEFT JOIN planner_program_planning_rm rm ON gm.id = rm.gm_id
//       LEFT JOIN planner_target_gm_rm trg ON rm.gm_rm_id = trg.id
//       LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
//       WHERE gm.state = ?
//       GROUP BY gm.center_code, gm.state, gm.district, pp.vertical_name
//       ORDER BY gm.center_code ASC
//     `, [state]);

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     sendError(res, "Failed to fetch center-wise data", error);
//   }
// };

// exports.getRMWiseData = async (req, res) => {
//   try {
//     const [rmTargets] = await db.query(`
//       SELECT 
//         rm.id AS rm_target_id,
//         rm.program_id,
//         rm.rm_name,
//         rm.total_target,
//         pp.vertical_name,
//         pp.funder_program_name AS project_name
//       FROM planner_target_gm_rm rm
//       LEFT JOIN planner_program_planning pp ON rm.program_id = pp.id
//     `);

//     const [quarterAllocations] = await db.query(`
//       SELECT program_id, gm_rm_id, center_code, fy_quarter, target, state, district
//       FROM planner_program_planning_gm
//     `);

//     const [achievements] = await db.query(`
//       SELECT program_id, gm_rm_id, fy_quarter, enrolled, trained, placed
//       FROM planner_program_planning_rm
//     `);

//     const result = [];

//     for (const rm of rmTargets) {
//       const rmId = rm.rm_target_id;
//       const relatedAllocations = quarterAllocations.filter(q => q.gm_rm_id === rmId);
//       const state = relatedAllocations.length > 0 ? relatedAllocations[0].state : "No Allocation Found";

//       const quarterTargets = {};
//       relatedAllocations.forEach(q => {
//         const qtr = q.fy_quarter;
//         quarterTargets[qtr] = (quarterTargets[qtr] || 0) + Number(q.target || 0);
//       });

//       const quarterAchievements = {};
//       achievements.filter(a => a.gm_rm_id === rmId).forEach(a => {
//         const qtr = a.fy_quarter;
//         if (!quarterAchievements[qtr]) quarterAchievements[qtr] = { enrolled: 0, trained: 0, placed: 0 };
//         quarterAchievements[qtr].enrolled += Number(a.enrolled || 0);
//         quarterAchievements[qtr].trained += Number(a.trained || 0);
//         quarterAchievements[qtr].placed += Number(a.placed || 0);
//       });

//       result.push({
//         rmName: rm.rm_name,
//         projectName: rm.project_name || "N/A",
//         vertical: rm.vertical_name || "N/A",
//         programId: rm.program_id,
//         state,
//         totalTarget: rm.total_target,
//         quarterTargets,
//         quarterAchievements,
//         centerCount: relatedAllocations.length,
//       });
//     }

//     res.json({ success: true, data: result });
//   } catch (error) {
//     sendError(res, "Failed to fetch RM-wise data", error);
//   }
// };

// exports.getBatchesByState = async (req, res) => {
//   const { stateName } = req.params;

//   if (!stateName) {
//     return res.status(400).json({ success: false, message: "State name is required." });
//   }

//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         gm.center_code,
//         rm.batch_code,
//         rm.enrolled,
//         rm.trained,
//         rm.placed,
//         COALESCE(pp.funder_program_name, 'N/A') AS projectName,
//         COALESCE(pp.vertical_name, 'N/A') AS verticalName
//       FROM planner_program_planning_rm rm
//       JOIN planner_program_planning_gm gm ON rm.gm_id = gm.id
//       LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
//       WHERE gm.state = ?
//       ORDER BY gm.center_code, rm.batch_code
//     `, [stateName]);

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     sendError(res, "Failed to fetch batch-wise data by state", error);
//   }
// };

// exports.getPMOWiseData = async (req, res) => {
//   try {
//     const [rows] = await db.query(`SELECT * FROM planner_program_planning`);

//     const pmoMap = new Map();

//     for (const row of rows) {
//       const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;

//       if (!pmoMap.has(key)) {
//         pmoMap.set(key, {
//           funderName: row.funder_name,
//           funderProgram: row.funder_program_name,
//           vertical: row.vertical_name,
//           totalEnrollmentTarget: 0,
//           totalTrainedTarget: 0,
//           totalPlacementTarget: 0,
//         });
//       }

//       const item = pmoMap.get(key);
//       item.totalEnrollmentTarget += Number(row.enrollment_target || 0);
//       item.totalTrainedTarget += Number(row.trained_target || 0);
//       item.totalPlacementTarget += Number(row.placement_target || 0);
//     }

//     const sortedData = Array.from(pmoMap.values()).sort((a, b) =>
//       a.funderProgram.localeCompare(b.funderProgram)
//     );

//     res.json({ success: true, type: "pmo", data: sortedData });
//   } catch (error) {
//     sendError(res, "Failed to fetch PMO-wise data", error);
//   }
// };


///////////////////////////////////////////////////////////////////////////

const db = require('../config/db');
require('dotenv').config();
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const sendError = (res, message, err = null) => {
  if (err) console.error(`❌ ${message}:`, err);
  res.status(500).json({ success: false, message });
};

const exportToCSV = (res, data, filenamePrefix = 'report') => {
  try {
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${filenamePrefix}_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    sendError(res, 'Failed to export CSV', error);
  }
};

const exportToPDF = (res, data, filenamePrefix = 'report') => {
  try {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filenamePrefix}_${Date.now()}.pdf"`);
    doc.pipe(res);

    const keys = Object.keys(data[0] || {});
    doc.fontSize(12).text(keys.join(' | '));
    doc.moveDown();

    data.forEach(row => {
      const line = keys.map(k => row[k]).join(' | ');
      doc.text(line);
    });

    doc.end();
  } catch (error) {
    sendError(res, 'Failed to export PDF', error);
  }
};

const paginate = (array, page, limit) => {
  const start = (page - 1) * limit;
  const end = page * limit;
  return array.slice(start, end);
};

exports.getStateCenters = async (req, res) => {
  const { state } = req.params;
  const { exportType, page = 1, limit = 50 } = req.query;

  if (!state) {
    return res.status(400).json({ success: false, message: "State parameter is required." });
  }

  try {
    const [rows] = await db.query(`
      SELECT 
        gm.center_code AS centerCode,
        gm.state,
        gm.district,
        SUM(gm.target) AS totalTarget,
        COALESCE(SUM(rm.enrolled), 0) AS enrolled,
        COALESCE(SUM(rm.trained), 0) AS trained,
        COALESCE(SUM(rm.placed), 0) AS placed,
        COALESCE(MAX(trg.rm_name), 'N/A') AS rmName,
        COALESCE(pp.vertical_name, 'Unknown') AS verticalName
      FROM planner_program_planning_gm gm
      LEFT JOIN planner_program_planning_rm rm ON gm.id = rm.gm_id
      LEFT JOIN planner_target_gm_rm trg ON rm.gm_rm_id = trg.id
      LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
      WHERE gm.state = ?
      GROUP BY gm.center_code, gm.state, gm.district, pp.vertical_name
      ORDER BY gm.center_code ASC
    `, [state]);

    if (exportType === 'csv') return exportToCSV(res, rows, 'state_centers');
    if (exportType === 'pdf') return exportToPDF(res, rows, 'state_centers');

    const paginatedData = paginate(rows, parseInt(page), parseInt(limit));
    res.json({ success: true, data: paginatedData, total: rows.length });
  } catch (error) {
    sendError(res, "Failed to fetch center-wise data", error);
  }
};

exports.getRMWiseData = async (req, res) => {
  const { exportType, page = 1, limit = 50 } = req.query;

  try {
    const [rmTargets] = await db.query(`
      SELECT 
        rm.id AS rm_target_id,
        rm.program_id,
        rm.rm_name,
        rm.total_target,
        pp.vertical_name,
        pp.funder_program_name AS project_name
      FROM planner_target_gm_rm rm
      LEFT JOIN planner_program_planning pp ON rm.program_id = pp.id
    `);

    const [quarterAllocations] = await db.query(`
      SELECT program_id, gm_rm_id, center_code, fy_quarter, target, state, district
      FROM planner_program_planning_gm
    `);

    const [achievements] = await db.query(`
      SELECT program_id, gm_rm_id, fy_quarter, enrolled, trained, placed
      FROM planner_program_planning_rm
    `);

    const result = [];

    for (const rm of rmTargets) {
      const rmId = rm.rm_target_id;
      const relatedAllocations = quarterAllocations.filter(q => q.gm_rm_id === rmId);
      const state = relatedAllocations.length > 0 ? relatedAllocations[0].state : "No Allocation Found";

      const quarterTargets = {};
      relatedAllocations.forEach(q => {
        const qtr = q.fy_quarter;
        quarterTargets[qtr] = (quarterTargets[qtr] || 0) + Number(q.target || 0);
      });

      const quarterAchievements = {};
      achievements.filter(a => a.gm_rm_id === rmId).forEach(a => {
        const qtr = a.fy_quarter;
        if (!quarterAchievements[qtr]) quarterAchievements[qtr] = { enrolled: 0, trained: 0, placed: 0 };
        quarterAchievements[qtr].enrolled += Number(a.enrolled || 0);
        quarterAchievements[qtr].trained += Number(a.trained || 0);
        quarterAchievements[qtr].placed += Number(a.placed || 0);
      });

      result.push({
        rmName: rm.rm_name,
        projectName: rm.project_name || "N/A",
        vertical: rm.vertical_name || "N/A",
        programId: rm.program_id,
        state,
        totalTarget: rm.total_target,
        quarterTargets: JSON.stringify(quarterTargets),
        quarterAchievements: JSON.stringify(quarterAchievements),
        centerCount: relatedAllocations.length,
      });
    }

    if (exportType === 'csv') return exportToCSV(res, result, 'rm_data');
    if (exportType === 'pdf') return exportToPDF(res, result, 'rm_data');

    const paginated = paginate(result, parseInt(page), parseInt(limit));
    res.json({ success: true, data: paginated, total: result.length });
  } catch (error) {
    sendError(res, "Failed to fetch RM-wise data", error);
  }
};

exports.getBatchesByState = async (req, res) => {
  const { stateName } = req.params;
  const { exportType, page = 1, limit = 50 } = req.query;

  if (!stateName) {
    return res.status(400).json({ success: false, message: "State name is required." });
  }

  try {
    const [rows] = await db.query(`
      SELECT 
        gm.center_code,
        rm.batch_code,
        rm.enrolled,
        rm.trained,
        rm.placed,
        COALESCE(pp.funder_program_name, 'N/A') AS projectName,
        COALESCE(pp.vertical_name, 'N/A') AS verticalName
      FROM planner_program_planning_rm rm
      JOIN planner_program_planning_gm gm ON rm.gm_id = gm.id
      LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
      WHERE gm.state = ?
      ORDER BY gm.center_code, rm.batch_code
    `, [stateName]);

    if (exportType === 'csv') return exportToCSV(res, rows, 'batches');
    if (exportType === 'pdf') return exportToPDF(res, rows, 'batches');

    const paginated = paginate(rows, parseInt(page), parseInt(limit));
    res.json({ success: true, data: paginated, total: rows.length });
  } catch (error) {
    sendError(res, "Failed to fetch batch-wise data by state", error);
  }
};

exports.getPMOWiseData = async (req, res) => {
  const { exportType, page = 1, limit = 50 } = req.query;

  try {
    const [rows] = await db.query(`SELECT * FROM planner_program_planning`);

    const pmoMap = new Map();

    for (const row of rows) {
      const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;

      if (!pmoMap.has(key)) {
        pmoMap.set(key, {
          funderName: row.funder_name,
          funderProgram: row.funder_program_name,
          vertical: row.vertical_name,
          totalEnrollmentTarget: 0,
          totalTrainedTarget: 0,
          totalPlacementTarget: 0,
        });
      }

      const item = pmoMap.get(key);
      item.totalEnrollmentTarget += Number(row.enrollment_target || 0);
      item.totalTrainedTarget += Number(row.trained_target || 0);
      item.totalPlacementTarget += Number(row.placement_target || 0);
    }

    const sortedData = Array.from(pmoMap.values()).sort((a, b) =>
      a.funderProgram.localeCompare(b.funderProgram)
    );

    if (exportType === 'csv') return exportToCSV(res, sortedData, 'pmo');
    if (exportType === 'pdf') return exportToPDF(res, sortedData, 'pmo');

    const paginated = paginate(sortedData, parseInt(page), parseInt(limit));
    res.json({ success: true, type: "pmo", data: paginated, total: sortedData.length });
  } catch (error) {
    sendError(res, "Failed to fetch PMO-wise data", error);
  }
};


///////////////////////////////////////////////////////////////////////////

// const db = require('../config/db');
// require('dotenv').config();
// const { Parser } = require('json2csv');
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// const sendError = (res, message, err = null) => {
//   if (err) console.error(`❌ ${message}:`, err);
//   res.status(500).json({ success: false, message });
// };

// const exportToCSV = (res, data, filenamePrefix = 'report') => {
//   try {
//     const parser = new Parser();
//     const csv = parser.parse(data);
//     res.header('Content-Type', 'text/csv');
//     res.attachment(`${filenamePrefix}_${Date.now()}.csv`);
//     res.send(csv);
//   } catch (error) {
//     sendError(res, 'Failed to export CSV', error);
//   }
// };

// const exportToPDF = (res, data, filenamePrefix = 'report') => {
//   try {
//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filenamePrefix}_${Date.now()}.pdf"`);
//     doc.pipe(res);

//     const keys = Object.keys(data[0] || {});
//     doc.fontSize(12).text(keys.join(' | '));
//     doc.moveDown();

//     data.forEach(row => {
//       const line = keys.map(k => row[k]).join(' | ');
//       doc.text(line);
//     });

//     doc.end();
//   } catch (error) {
//     sendError(res, 'Failed to export PDF', error);
//   }
// };

// exports.getStateCenters = async (req, res) => {
//   const { state } = req.params;
//   const { exportType } = req.query;

//   if (!state) {
//     return res.status(400).json({ success: false, message: "State parameter is required." });
//   }

//   try {
//     const [rows] = await db.query(`
//       SELECT
//         gm.center_code AS centerCode,
//         gm.state,
//         gm.district,
//         SUM(gm.target) AS totalTarget,
//         COALESCE(SUM(rm.enrolled), 0) AS enrolled,
//         COALESCE(SUM(rm.trained), 0) AS trained,
//         COALESCE(SUM(rm.placed), 0) AS placed,
//         COALESCE(MAX(trg.rm_name), 'N/A') AS rmName,
//         COALESCE(pp.vertical_name, 'Unknown') AS verticalName
//       FROM planner_program_planning_gm gm
//       LEFT JOIN planner_program_planning_rm rm ON gm.id = rm.gm_id
//       LEFT JOIN planner_target_gm_rm trg ON rm.gm_rm_id = trg.id
//       LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
//       WHERE gm.state = ?
//       GROUP BY gm.center_code, gm.state, gm.district, pp.vertical_name
//       ORDER BY gm.center_code ASC
//     `, [state]);

//     if (exportType === 'csv') return exportToCSV(res, rows, 'state_centers');
//     if (exportType === 'pdf') return exportToPDF(res, rows, 'state_centers');

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     sendError(res, "Failed to fetch center-wise data", error);
//   }
// };

// exports.getRMWiseData = async (req, res) => {
//   const { exportType } = req.query;

//   try {
//     const [rmTargets] = await db.query(`
//       SELECT
//         rm.id AS rm_target_id,
//         rm.program_id,
//         rm.rm_name,
//         rm.total_target,
//         pp.vertical_name,
//         pp.funder_program_name AS project_name
//       FROM planner_target_gm_rm rm
//       LEFT JOIN planner_program_planning pp ON rm.program_id = pp.id
//     `);

//     const [quarterAllocations] = await db.query(`
//       SELECT program_id, gm_rm_id, center_code, fy_quarter, target, state, district
//       FROM planner_program_planning_gm
//     `);

//     const [achievements] = await db.query(`
//       SELECT program_id, gm_rm_id, fy_quarter, enrolled, trained, placed
//       FROM planner_program_planning_rm
//     `);

//     const result = [];

//     for (const rm of rmTargets) {
//       const rmId = rm.rm_target_id;
//       const relatedAllocations = quarterAllocations.filter(q => q.gm_rm_id === rmId);
//       const state = relatedAllocations.length > 0 ? relatedAllocations[0].state : "No Allocation Found";

//       const quarterTargets = {};
//       relatedAllocations.forEach(q => {
//         const qtr = q.fy_quarter;
//         quarterTargets[qtr] = (quarterTargets[qtr] || 0) + Number(q.target || 0);
//       });

//       const quarterAchievements = {};
//       achievements.filter(a => a.gm_rm_id === rmId).forEach(a => {
//         const qtr = a.fy_quarter;
//         if (!quarterAchievements[qtr]) quarterAchievements[qtr] = { enrolled: 0, trained: 0, placed: 0 };
//         quarterAchievements[qtr].enrolled += Number(a.enrolled || 0);
//         quarterAchievements[qtr].trained += Number(a.trained || 0);
//         quarterAchievements[qtr].placed += Number(a.placed || 0);
//       });

//       result.push({
//         rmName: rm.rm_name,
//         projectName: rm.project_name || "N/A",
//         vertical: rm.vertical_name || "N/A",
//         programId: rm.program_id,
//         state,
//         totalTarget: rm.total_target,
//         quarterTargets: JSON.stringify(quarterTargets),
//         quarterAchievements: JSON.stringify(quarterAchievements),
//         centerCount: relatedAllocations.length,
//       });
//     }

//     if (exportType === 'csv') return exportToCSV(res, result, 'rm_data');
//     if (exportType === 'pdf') return exportToPDF(res, result, 'rm_data');

//     res.json({ success: true, data: result });
//   } catch (error) {
//     sendError(res, "Failed to fetch RM-wise data", error);
//   }
// };

// exports.getBatchesByState = async (req, res) => {
//   const { stateName } = req.params;
//   const { exportType } = req.query;

//   if (!stateName) {
//     return res.status(400).json({ success: false, message: "State name is required." });
//   }

//   try {
//     const [rows] = await db.query(`
//       SELECT
//         gm.center_code,
//         rm.batch_code,
//         rm.enrolled,
//         rm.trained,
//         rm.placed,
//         COALESCE(pp.funder_program_name, 'N/A') AS projectName,
//         COALESCE(pp.vertical_name, 'N/A') AS verticalName
//       FROM planner_program_planning_rm rm
//       JOIN planner_program_planning_gm gm ON rm.gm_id = gm.id
//       LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
//       WHERE gm.state = ?
//       ORDER BY gm.center_code, rm.batch_code
//     `, [stateName]);

//     if (exportType === 'csv') return exportToCSV(res, rows, 'batches');
//     if (exportType === 'pdf') return exportToPDF(res, rows, 'batches');

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     sendError(res, "Failed to fetch batch-wise data by state", error);
//   }
// };

// exports.getPMOWiseData = async (req, res) => {
//   const { exportType } = req.query;

//   try {
//     const [rows] = await db.query(`SELECT * FROM planner_program_planning`);

//     const pmoMap = new Map();

//     for (const row of rows) {
//       const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;

//       if (!pmoMap.has(key)) {
//         pmoMap.set(key, {
//           funderName: row.funder_name,
//           funderProgram: row.funder_program_name,
//           vertical: row.vertical_name,
//           totalEnrollmentTarget: 0,
//           totalTrainedTarget: 0,
//           totalPlacementTarget: 0,
//         });
//       }

//       const item = pmoMap.get(key);
//       item.totalEnrollmentTarget += Number(row.enrollment_target || 0);
//       item.totalTrainedTarget += Number(row.trained_target || 0);
//       item.totalPlacementTarget += Number(row.placement_target || 0);
//     }

//     const sortedData = Array.from(pmoMap.values()).sort((a, b) =>
//       a.funderProgram.localeCompare(b.funderProgram)
//     );

//     if (exportType === 'csv') return exportToCSV(res, sortedData, 'pmo');
//     if (exportType === 'pdf') return exportToPDF(res, sortedData, 'pmo');

//     res.json({ success: true, type: "pmo", data: sortedData });
//   } catch (error) {
//     sendError(res, "Failed to fetch PMO-wise data", error);
//   }
// };



////////////////////////////////////////////////////////////








// const db = require('../config/db');

// exports.getCenterWiseData = async (req, res) => {
//   try {
//     const data = await fetchHierarchy();
//     res.json({ success: true, type: 'center', data });
//   } catch (err) {
//     console.error('❌ Center Wise Error:', err.message);
//     res.status(500).json({ success: false, message: 'Center data fetch failed' });
//   }
// };

// exports.getBatchWiseData = async (req, res) => {
//   try {
//     const data = await fetchHierarchy();
//     res.json({ success: true, type: 'batch', data });
//   } catch (err) {
//     console.error('❌ Batch Wise Error:', err.message);
//     res.status(500).json({ success: false, message: 'Batch data fetch failed' });
//   }
// };

// exports.getQuarterWiseData = async (req, res) => {
//   try {
//     const data = await fetchHierarchy();
//     res.json({ success: true, type: 'quarter', data });
//   } catch (err) {
//     console.error('❌ Quarter Wise Error:', err.message);
//     res.status(500).json({ success: false, message: 'Quarter data fetch failed' });
//   }
// };



// exports.getStateCenters = async (req, res) => {
//   const { state } = req.params;

//   try {
//     const [rows] = await db.query(`
//       SELECT
//         gm.center_code AS centerCode,
//         gm.state,
//         gm.district,
//         SUM(gm.target) AS totalTarget,
//         COALESCE(SUM(rm.enrolled), 0) AS enrolled,
//         COALESCE(SUM(rm.trained), 0) AS trained,
//         COALESCE(SUM(rm.placed), 0) AS placed,
//         COALESCE(MAX(trg.rm_name), 'N/A') AS rmName,
//         pp.vertical_name AS verticalName
//       FROM planner_program_planning_gm gm
//       LEFT JOIN planner_program_planning_rm rm ON gm.id = rm.gm_id
//       LEFT JOIN planner_target_gm_rm trg ON rm.gm_rm_id = trg.id
//       LEFT JOIN planner_program_planning pp ON gm.program_id = pp.id
//       WHERE gm.state = ?
//       GROUP BY gm.center_code, gm.state, gm.district, pp.vertical_name
//     `, [state]);

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error("❌ Error in getStateCenters:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// exports.getRMWiseData = async (req, res) => {
//   try {
//     // 1. Fetch RM-wise total targets with vertical and project (funder) name
//     const [rmTargets] = await db.query(`
//       SELECT
//         rm.id AS rm_target_id,
//         rm.program_id,
//         rm.rm_name,
//         rm.total_target,
//         pp.vertical_name,
//         pp.funder_program_name
//          AS project_name  -- ✅ this is your actual "project"
//       FROM planner_target_gm_rm rm
//       LEFT JOIN planner_program_planning pp ON rm.program_id = pp.id
//     `);

//     // 2. Fetch quarter-wise center allocations (includes state)
//     const [quarterAllocations] = await db.query(`
//       SELECT program_id, gm_rm_id, center_code, fy_quarter, target, state, district
//       FROM planner_program_planning_gm
//     `);

//     // 3. Fetch achievement data
//     const [achievements] = await db.query(`
//       SELECT program_id, gm_rm_id, fy_quarter, enrolled, trained, placed
//       FROM planner_program_planning_rm
//     `);

//     // 4. Combine & process data
//     const result = [];

//     for (const rm of rmTargets) {
//       const rmId = rm.rm_target_id;

//       // Get all related allocations for this RM
//       const relatedAllocations = quarterAllocations.filter(q => q.gm_rm_id === rmId);
//       const state = relatedAllocations[0]?.state || "Unknown"; // ✅ Extract state from any allocation

//       // Quarter-wise target map
//       const quarterTargetMap = {};
//       relatedAllocations.forEach(q => {
//         const quarter = q.fy_quarter;
//         quarterTargetMap[quarter] = (quarterTargetMap[quarter] || 0) + Number(q.target || 0);
//       });

//       // Quarter-wise achievement map
//       const quarterAchieveMap = {};
//       achievements
//         .filter(a => a.gm_rm_id === rmId)
//         .forEach(a => {
//           const quarter = a.fy_quarter;
//           if (!quarterAchieveMap[quarter]) {
//             quarterAchieveMap[quarter] = { enrolled: 0, trained: 0, placed: 0 };
//           }
//           quarterAchieveMap[quarter].enrolled += Number(a.enrolled || 0);
//           quarterAchieveMap[quarter].trained += Number(a.trained || 0);
//           quarterAchieveMap[quarter].placed += Number(a.placed || 0);
//         });

//       // Final result object
//       result.push({
//         rmName: rm.rm_name,
//         programId: rm.program_id,
//         projectName: rm.project_name || "N/A",  // ✅ Added project
//         vertical: rm.vertical_name || "N/A",
//         totalTarget: rm.total_target,
//         quarterTargets: quarterTargetMap,
//         quarterAchievements: quarterAchieveMap,
//         state: state,
//       });
//     }

//     res.json({ success: true, data: result });
//   } catch (error) {
//     console.error("❌ RM Wise Error (final catch):", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// exports.getBatchesByState = async (req, res) => {
//   const { stateName } = req.params;

//   try {
//     const [rows] = await db.query(
//       `
//       SELECT
//         gm.center_code,
//         rm.batch_code,
//         rm.enrolled,
//         rm.trained,
//         rm.placed
//       FROM planner_program_planning_rm rm
//       JOIN planner_program_planning_gm gm ON rm.gm_id = gm.id
//       WHERE gm.state = ?
//       `,
//       [stateName]
//     );

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error("❌ Error fetching batch-wise data by state:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// exports.getPMOWiseData = async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM planner_program_planning");

//     const pmoMap = new Map();

//     for (const row of rows) {
//       const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;

//       if (!pmoMap.has(key)) {
//         pmoMap.set(key, {
//           funderName: row.funder_name,
//           funderProgram: row.funder_program_name,
//           vertical: row.vertical_name,
//           totalEnrollmentTarget: 0,
//           totalTrainedTarget: 0,
//           totalPlacementTarget: 0,
//         });
//       }

//       const pmo = pmoMap.get(key);
//       pmo.totalEnrollmentTarget += Number(row.enrollment_target || 0);
//       pmo.totalTrainedTarget += Number(row.trained_target || 0);
//       pmo.totalPlacementTarget += Number(row.placement_target || 0);
//     }

//     res.json({
//       success: true,
//       type: "pmo",
//       data: Array.from(pmoMap.values()),
//     });
//   } catch (error) {
//     console.error("Error in getPMOWiseData:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

