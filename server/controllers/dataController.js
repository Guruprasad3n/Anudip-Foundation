// const db = require('../config/db');

// const getAllData = async (req, res) => {
//     const databaseName = 'anudip_cmis17'; // 

//     const getTablesQuery = `SHOW TABLES FROM ${databaseName}`;

//     db.query(getTablesQuery, async (err, tables) => {
//         if (err) {
//             console.error('Error fetching tables:', err);
//             return res.status(500).json({ error: 'Failed to get tables' });
//         }

//         const tableKey = `Tables_in_${databaseName}`;
//         const allData = {};

//         // Counter to manage async db calls
//         let completed = 0;

//         tables.forEach((table) => {
//             const tableName = table[tableKey];
//             const tableQuery = `SELECT * FROM ${tableName}`;

//             db.query(tableQuery, (err, results) => {
//                 completed++;

//                 if (err) {
//                     console.error(`Error fetching data from ${tableName}:`, err);
//                     allData[tableName] = { error: 'Query failed' };
//                 } else {
//                     allData[tableName] = results;
//                 }

//                 // Once all tables are processed
//                 if (completed === tables.length) {
//                     res.status(200).json(allData);
//                 }
//             });
//         });
//     });
// };

// module.exports = { getAllData };


// controllers/performanceController.js
const db = require('../config/db');


// exports.getProjectHierarchyData = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         gm.id AS gm_id, gm.first_name AS gm_name,
//         rm.id AS rm_id, rm.first_name AS rm_name,
//         m.p_state AS state,
//         pp.center_id, m.member_code AS center_code,
//         pp.quarter, pp.project_name,
//         pp.enrollment_target, pp.training_target, pp.placement_target,
//         pp.actual_enrollment, pp.actual_training, pp.actual_placement
//       FROM planner_program_planning AS pp
//       LEFT JOIN planner_program_planning_gm AS gm ON gm.id = pp.funder_id
//       LEFT JOIN planner_program_planning_rm AS rm ON rm.id = pp.rm_id
//       LEFT JOIN members AS m ON m.id = pp.center_id
//       WHERE pp.project_name IN ('Diya', 'SAVE', 'DeepTech')
//     `);

//     res.json({ success: true, data: rows });
//   } catch (err) {
//     console.error('Error fetching project hierarchy data:', err);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };

exports.getStatePerformance = async (req, res) => {
  try {
    const query = `
      SELECT 
        m.p_state AS state,
        SUM(pp.enrollment_target) AS total_enrollment_target,
        SUM(pp.placement_target) AS total_placement_target
      FROM planner_program_planning AS pp
      JOIN members AS m ON m.id = pp.center_id
      GROUP BY m.p_state
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching state performance", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getProjects = async (req, res) => {
    const { rm_id } = req.query;

    try {
        let query = `
      SELECT 
        pp.project_name,
        gm.first_name AS gm_name,
        rm.first_name AS rm_name,
        pp.vertex,
        pp.target,
        pp.actual_enrollments,
        pp.actual_trainings,
        pp.actual_placements
      FROM planner_program_planning AS pp
      JOIN planner_program_planning_gm AS gm ON pp.funder_id = gm.id
      JOIN planner_program_planning_rm AS rm ON pp.rm_id = rm.id
    `;

        let result;
        if (rm_id) {
            query += ` WHERE pp.rm_id = $1`;
            result = await db.query(query, [rm_id]);
        } else {
            result = await db.query(query);
        }
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching project data", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getCentersByState = async (req, res) => {
    const { state_name } = req.params;

    try {
        const query = `
      SELECT 
        pp.center_code,
        SUM(pp.target) AS target,
        SUM(pp.actual_enrollments) AS enrollments,
        SUM(pp.actual_trainings) AS trainings,
        SUM(pp.actual_placements) AS placements
      FROM planner_program_planning AS pp
      JOIN members AS m ON m.id = pp.center_id
      WHERE m.p_state = $1
      GROUP BY pp.center_code
    `;
        const result = await db.query(query, [state_name]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching centers", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getBatchesByCenter = async (req, res) => {
    const { center_code } = req.params;

    try {
        const query = `
      SELECT 
        batch_code,
        quarter,
        enrollments,
        trainings,
        placements
      FROM batches
      WHERE center_code = $1
    `;
        const result = await db.query(query, [center_code]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching batches", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// exports.getAllBatches = (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const countQuery = 'SELECT COUNT(*) AS total FROM batches';
//     const dataQuery = `SELECT * FROM batches LIMIT ? OFFSET ?`;

//     db.query(countQuery, (err, countResult) => {
//         if (err) {
//             console.error('Error counting batches:', err);
//             return res.status(500).json({ error: 'Database error (count)' });
//         }

//         const total = countResult[0].total;


//         db.query(dataQuery, [limit, offset], (err, results) => {
//             if (err) {
//                 console.error('Error fetching batches:', err);
//                 return res.status(500).json({ error: 'Database error (data)' });
//             }

//             res.json({
//                 page,
//                 limit,
//                 total,
//                 totalPages: Math.ceil(total / limit),
//                 data: results
//             });
//         });
//     });
// };

exports.getMembers = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    const offset = (page - 1) * limit;

    // const countQuery = 'SELECT COUNT(*) AS total FROM planner_target_gm_rm';
    const countQuery = 'SELECT COUNT(*) AS total FROM planner_program_planning';
    const dataQuery = `SELECT * FROM members LIMIT ? OFFSET ?`;

    db.query(countQuery, (err, countResult) => {
        if (err) {
            console.error('Error counting members:', err);
            return res.status(500).json({ error: 'Database error (count)' });
        }

        const total = countResult[0].total;


        db.query(dataQuery, [limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching members:', err);
                return res.status(500).json({ error: 'Database error (data)' });
            }

            res.json({
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                data: results
            });
        });
    });
};


exports.getBatchById = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM batches WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching batch by ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        res.json(results[0]);
    });
};


const express = require('express');
const router = express.Router();


const controller = require("../controllers/batchController");


router.get('/project-hierarchy', controller.getProjectHierarchyData);

router.get("/state-performance", controller.getStatePerformance);
router.get("/projects", controller.getProjects);
router.get("/centers/:state_name", controller.getCentersByState);
router.get("/batches/:center_code", controller.getBatchesByCenter);

const batchController = require('../controllers/batchController');


// router.get('/data', batchController.getAllBatches);
router.get('/members', batchController.getMembers);
// router.get('/data/:id', batchController.getBatchById);

module.exports = router;

