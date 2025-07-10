// controllers/exportController.js
const db = require('../config/db');
require('dotenv').config();
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

const sendError = (res, message, err = null) => {
  if (err) console.error(`\u274C ${message}:`, err);
  res.status(500).json({ success: false, message });
};

const exportToCSV = (res, data, fields, filenamePrefix = 'report') => {
  try {
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${filenamePrefix}_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    sendError(res, 'Failed to export CSV', error);
  }
};

// const exportToPDF = (res, data, fields, filenamePrefix = 'report') => {
//   try {
//     const doc = new PDFDocument({ margin: 30 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename="${filenamePrefix}_${Date.now()}.pdf"`
//     );
//     doc.pipe(res);

//     const rowHeight = 25;
//     const columnWidth = 100;
//     let y = 50;
//     let x;

//     // Header
//     doc.font('Helvetica-Bold').fontSize(10);
//     x = doc.page.margins.left;
//     fields.forEach(field => {
//       doc.rect(x, y, columnWidth, rowHeight).stroke();
//       doc.text(field.label || field, x + 5, y + 7, {
//         width: columnWidth - 10,
//         align: 'left'
//       });
//       x += columnWidth;
//     });

//     // Rows
//     doc.font('Helvetica').fontSize(9);
//     y += rowHeight;
//     data.forEach(row => {
//       x = doc.page.margins.left;
//       fields.forEach(field => {
//         const key = typeof field === 'object' ? field.value : field;
//         doc.rect(x, y, columnWidth, rowHeight).stroke();
//         doc.text(String(row[key] ?? ''), x + 5, y + 7, {
//           width: columnWidth - 10,
//           align: 'left'
//         });
//         x += columnWidth;
//       });
//       y += rowHeight;
//     });

//     doc.end();
//   } catch (error) {
//     sendError(res, 'Failed to export PDF', error);
//   }
// };


const exportToPDF = (res, data, fields, filenamePrefix = 'report') => {
  try {
    const margin = 30;

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape', // Always landscape for more room
      margin,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filenamePrefix}_${Date.now()}.pdf"`
    );
    doc.pipe(res);

    const usableWidth = doc.page.width - margin * 2;
    const columnWidth = usableWidth / fields.length;
    const rowHeight = 25;

    const maxY = doc.page.height - margin;

    let y = margin;

    const drawHeader = () => {
      let x = margin;
      doc.font('Helvetica-Bold').fontSize(10);
      fields.forEach(field => {
        doc.rect(x, y, columnWidth, rowHeight).stroke();
        doc.text(field.label || field, x + 5, y + 7, {
          width: columnWidth - 10,
          align: 'left',
        });
        x += columnWidth;
      });
      y += rowHeight;
    };

    const drawRow = (row) => {
      let x = margin;
      doc.font('Helvetica').fontSize(9);
      fields.forEach(field => {
        const key = typeof field === 'object' ? field.value : field;
        doc.rect(x, y, columnWidth, rowHeight).stroke();
        doc.text(String(row[key] ?? ''), x + 5, y + 7, {
          width: columnWidth - 10,
          align: 'left',
        });
        x += columnWidth;
      });
      y += rowHeight;
    };

    drawHeader();
    data.forEach(row => {
      if (y + rowHeight > maxY) {
        doc.addPage({ layout: 'landscape', margin });
        y = margin;
        drawHeader(); // Redraw header on new page
      }
      drawRow(row);
    });

    doc.end();
  } catch (error) {
    sendError(res, 'Failed to export PDF', error);
  }
};




const paginate = (array, page, limit) => {
  const start = (page - 1) * limit;
  return array.slice(start, start + limit);
};

exports.getStateCenters = async (req, res) => {
  const { state } = req.params;
  const { exportType, page = 1, limit = 50 } = req.query;

  if (!state) return res.status(400).json({ success: false, message: 'State parameter is required.' });

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

    const fields = [
      { label: 'Center Code', value: 'centerCode' },
      { label: 'State', value: 'state' },
      { label: 'District', value: 'district' },
      { label: 'Total Target', value: 'totalTarget' },
      { label: 'Enrolled', value: 'enrolled' },
      { label: 'Trained', value: 'trained' },
      { label: 'Placed', value: 'placed' },
      { label: 'RM Name', value: 'rmName' },
      { label: 'Vertical', value: 'verticalName' },
    ];

    if (exportType === 'csv') return exportToCSV(res, rows, fields, 'state_centers');
    if (exportType === 'pdf') return exportToPDF(res, rows, fields, 'state_centers');

    res.json({ success: true, data: paginate(rows, parseInt(page), parseInt(limit)), total: rows.length });
  } catch (error) {
    sendError(res, 'Failed to fetch center-wise data', error);
  }
};

exports.getBatchesByState = async (req, res) => {
  const { stateName } = req.params;
  const { exportType, page = 1, limit = 50 } = req.query;

  if (!stateName) return res.status(400).json({ success: false, message: 'State name is required.' });

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

    const fields = [
      { label: 'Center Code', value: 'center_code' },
      { label: 'Batch Code', value: 'batch_code' },
      { label: 'Enrolled', value: 'enrolled' },
      { label: 'Trained', value: 'trained' },
      { label: 'Placed', value: 'placed' },
      { label: 'Project', value: 'projectName' },
      { label: 'Vertical', value: 'verticalName' },
    ];

    if (exportType === 'csv') return exportToCSV(res, rows, fields, 'batch_data');
    if (exportType === 'pdf') return exportToPDF(res, rows, fields, 'batch_data');

    res.json({ success: true, data: paginate(rows, parseInt(page), parseInt(limit)), total: rows.length });
  } catch (error) {
    sendError(res, 'Failed to fetch batch-wise data by state', error);
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

    const result = rmTargets.map(rm => {
      const allocations = quarterAllocations.filter(q => q.gm_rm_id === rm.rm_target_id);
      const state = allocations[0]?.state || 'N/A';
      const quarterTargets = {};
      const quarterAchievements = {};

      allocations.forEach(q => {
        quarterTargets[q.fy_quarter] = (quarterTargets[q.fy_quarter] || 0) + Number(q.target);
      });

      achievements
        .filter(a => a.gm_rm_id === rm.rm_target_id)
        .forEach(a => {
          if (!quarterAchievements[a.fy_quarter]) quarterAchievements[a.fy_quarter] = { enrolled: 0, trained: 0, placed: 0 };
          quarterAchievements[a.fy_quarter].enrolled += Number(a.enrolled);
          quarterAchievements[a.fy_quarter].trained += Number(a.trained);
          quarterAchievements[a.fy_quarter].placed += Number(a.placed);
        });

      return {
        rmName: rm.rm_name,
        projectName: rm.project_name || 'N/A',
        vertical: rm.vertical_name || 'N/A',
        state,
        totalTarget: rm.total_target,
        centerCount: allocations.length,
        quarterTargets,
        quarterAchievements,
      };
    });

    const flatData = result.map(item => {
      const base = {
        rmName: item.rmName,
        projectName: item.projectName,
        vertical: item.vertical,
        state: item.state,
        totalTarget: item.totalTarget,
        centerCount: item.centerCount,
      };
      for (let q = 1; q <= 4; q++) {
        base[`Q${q} Target`] = item.quarterTargets[q] || 0;
        base[`Q${q} Enrolled`] = item.quarterAchievements[q]?.enrolled || 0;
        base[`Q${q} Trained`] = item.quarterAchievements[q]?.trained || 0;
        base[`Q${q} Placed`] = item.quarterAchievements[q]?.placed || 0;
      }
      return base;
    });

    const fields = Object.keys(flatData[0] || {}).map(k => ({ label: k, value: k }));

    if (exportType === 'csv') return exportToCSV(res, flatData, fields, 'rm_data');
    if (exportType === 'pdf') return exportToPDF(res, flatData, fields, 'rm_data');

    res.json({ success: true, data: paginate(flatData, parseInt(page), parseInt(limit)), total: flatData.length });
  } catch (error) {
    sendError(res, 'Failed to fetch RM-wise data', error);
  }
};

// exports.getPMOWiseData = async (req, res) => {
//   const { exportType, page = 1, limit = 50 } = req.query;

//   try {
//     const [rows] = await db.query(`SELECT * FROM planner_program_planning`);

//     const grouped = {};

//     rows.forEach(row => {
//       const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;
//       if (!grouped[key]) {
//         grouped[key] = {
//           funderName: row.funder_name,
//           funderProgram: row.funder_program_name,
//           vertical: row.vertical_name,
//           totalEnrollmentTarget: 0,
//           totalTrainedTarget: 0,
//           totalPlacementTarget: 0,
//         };
//       }
//       grouped[key].totalEnrollmentTarget += Number(row.enrollment_target || 0);
//       grouped[key].totalTrainedTarget += Number(row.trained_target || 0);
//       grouped[key].totalPlacementTarget += Number(row.placement_target || 0);
//     });

//     const sorted = Object.values(grouped).sort((a, b) => a.funderProgram.localeCompare(b.funderProgram));

//     const fields = [
//       { label: 'Funder', value: 'funderName' },
//       { label: 'Program', value: 'funderProgram' },
//       { label: 'Vertical', value: 'vertical' },
//       { label: 'Enrolled Target', value: 'totalEnrollmentTarget' },
//       { label: 'Trained Target', value: 'totalTrainedTarget' },
//       { label: 'Placed Target', value: 'totalPlacementTarget' },
//     ];

//     if (exportType === 'csv') return exportToCSV(res, sorted, fields, 'pmo_data');
//     if (exportType === 'pdf') return exportToPDF(res, sorted, fields, 'pmo_data');

//     res.json({ success: true, data: paginate(sorted, parseInt(page), parseInt(limit)), total: sorted.length });
//   } catch (error) {
//     sendError(res, 'Failed to fetch PMO-wise data', error);
//   }
// };



// exports.getPMOWiseData = async (req, res) => {
//   const { exportType, page = 1, limit = 50 } = req.query;

//   try {
//     const [rows] = await db.query(`SELECT * FROM planner_program_planning`);

//     const grouped = {};

//     rows.forEach(row => {
//       const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;

//       // Only take the first row per key
//       if (!grouped[key]) {
//         grouped[key] = {
//           funderName: row.funder_name,
//           funderProgram: row.funder_program_name,
//           vertical: row.vertical_name,
//           totalEnrollmentTarget: Number(row.enrollment_target || 0),
//           totalTrainedTarget: Number(row.trained_target || 0),
//           totalPlacementTarget: Number(row.placement_target || 0),
//         };
//       }
//     });

//     const result = Object.values(grouped);

//     const fields = [
//       { label: 'Funder', value: 'funderName' },
//       { label: 'Program', value: 'funderProgram' },
//       { label: 'Vertical', value: 'vertical' },
//       { label: 'Enrolled Target', value: 'totalEnrollmentTarget' },
//       { label: 'Trained Target', value: 'totalTrainedTarget' },
//       { label: 'Placed Target', value: 'totalPlacementTarget' },
//     ];

//     if (exportType === 'csv') return exportToCSV(res, result, fields, 'pmo_data');
//     if (exportType === 'pdf') return exportToPDF(res, result, fields, 'pmo_data');

//     res.json({
//       success: true,
//       data: paginate(result, parseInt(page), parseInt(limit)),
//       total: result.length,
//     });
//   } catch (error) {
//     sendError(res, 'Failed to fetch PMO-wise data', error);
//   }
// };

exports.getPMOWiseData = async (req, res) => {
  const { exportType, page = 1, limit = 50 } = req.query;

  try {
    const [targets] = await db.query(`SELECT * FROM planner_program_planning`);
    const [achievements] = await db.query(`SELECT * FROM planner_program_planning_rm`);

    const grouped = {};

    targets.forEach(row => {
      const key = `${row.funder_name}-${row.funder_program_name}-${row.vertical_name}`;

      // Take only one target row per project
      if (!grouped[key]) {
        grouped[key] = {
          funderName: row.funder_name,
          funderProgram: row.funder_program_name,
          vertical: row.vertical_name,
          totalEnrollmentTarget: Number(row.enrollment_target || 0),
          totalTrainedTarget: Number(row.trained_target || 0),
          totalPlacementTarget: Number(row.placement_target || 0),
          totalEnrolled: 0,
          totalTrained: 0,
          totalPlaced: 0
        };
      }
    });

    // Add achievements from `planner_program_planning_rm`
    achievements.forEach(row => {
      const [projectRow] = targets.filter(
        t => t.id === row.program_id
      );

      if (projectRow) {
        const key = `${projectRow.funder_name}-${projectRow.funder_program_name}-${projectRow.vertical_name}`;
        if (grouped[key]) {
          grouped[key].totalEnrolled += Number(row.enrolled || 0);
          grouped[key].totalTrained += Number(row.trained || 0);
          grouped[key].totalPlaced += Number(row.placed || 0);
        }
      }
    });

    const result = Object.values(grouped);

    const fields = [
      { label: 'Funder', value: 'funderName' },
      { label: 'Program', value: 'funderProgram' },
      { label: 'Vertical', value: 'vertical' },
      { label: 'Enrolled Target', value: 'totalEnrollmentTarget' },
      { label: 'Trained Target', value: 'totalTrainedTarget' },
      { label: 'Placed Target', value: 'totalPlacementTarget' },
      { label: 'Enrolled Achieved', value: 'totalEnrolled' },
      { label: 'Trained Achieved', value: 'totalTrained' },
      { label: 'Placed Achieved', value: 'totalPlaced' },
    ];

    if (exportType === 'csv') return exportToCSV(res, result, fields, 'pmo_data');
    if (exportType === 'pdf') return exportToPDF(res, result, fields, 'pmo_data');

    res.json({
      success: true,
      data: paginate(result, parseInt(page), parseInt(limit)),
      total: result.length,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch PMO-wise data', error);
  }
};




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



// const exportToCSV = (res, rawData, filenamePrefix = 'report') => {
//   try {
//     const data = rawData.map(item => {
//       const base = {
//         rmName: item.rmName,
//         projectName: item.projectName,
//         vertical: item.vertical,
//         state: item.state,
//         totalTarget: item.totalTarget,
//         centerCount: item.centerCount,
//       };


//       const quarterTargets = JSON.parse(item.quarterTargets || '{}');
//       const quarterAchievements = JSON.parse(item.quarterAchievements || '{}');

//       // Add flattened Q1–Q4 data
//       for (let q = 1; q <= 4; q++) {
//         base[`Q${q} Target`] = quarterTargets[q] || 0;
//         base[`Q${q} Enrolled`] = quarterAchievements[q]?.enrolled || 0;
//         base[`Q${q} Trained`] = quarterAchievements[q]?.trained || 0;
//         base[`Q${q} Placed`] = quarterAchievements[q]?.placed || 0;
//       }

//       return base;
//     });

//     const parser = new Parser();
//     const csv = parser.parse(data);

//     res.header('Content-Type', 'text/csv');
//     res.attachment(`${filenamePrefix}_${Date.now()}.csv`);
//     res.send(csv);
//   } catch (error) {
//     console.error(error);
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

// const paginate = (array, page, limit) => {
//   const start = (page - 1) * limit;
//   const end = page * limit;
//   return array.slice(start, end);
// };

// exports.getStateCenters = async (req, res) => {
//   const { state } = req.params;
//   const { exportType, page = 1, limit = 50 } = req.query;

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

//     const paginatedData = paginate(rows, parseInt(page), parseInt(limit));
//     res.json({ success: true, data: paginatedData, total: rows.length });
//   } catch (error) {
//     sendError(res, "Failed to fetch center-wise data", error);
//   }
// };

// exports.getRMWiseData = async (req, res) => {
//   const { exportType, page = 1, limit = 50 } = req.query;

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

//     const paginated = paginate(result, parseInt(page), parseInt(limit));
//     res.json({ success: true, data: paginated, total: result.length });
//   } catch (error) {
//     sendError(res, "Failed to fetch RM-wise data", error);
//   }
// };

// exports.getBatchesByState = async (req, res) => {
//   const { stateName } = req.params;
//   const { exportType, page = 1, limit = 50 } = req.query;

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

//     const paginated = paginate(rows, parseInt(page), parseInt(limit));
//     res.json({ success: true, data: paginated, total: rows.length });
//   } catch (error) {
//     sendError(res, "Failed to fetch batch-wise data by state", error);
//   }
// };

// exports.getPMOWiseData = async (req, res) => {
//   const { exportType, page = 1, limit = 50 } = req.query;

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

//     const paginated = paginate(sortedData, parseInt(page), parseInt(limit));
//     res.json({ success: true, type: "pmo", data: paginated, total: sortedData.length });
//   } catch (error) {
//     sendError(res, "Failed to fetch PMO-wise data", error);
//   }
// };

