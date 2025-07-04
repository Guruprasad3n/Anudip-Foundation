// controllers/batchController.js
const db = require('../config/db');

// exports.getProjectHierarchyData = async (req, res) => {
//   try {
//     const [projects] = await db.query(`
//       SELECT 
//         id AS funder_id,
//         vertical_name,
//         funder_name,
//         funder_program_name,
//         enrollment_target,
//         trained_target,
//         placement_target
//       FROM planner_program_planning
//       WHERE funder_program_name LIKE '%Diya%'
//          OR funder_program_name LIKE '%SAVE%'
//          OR funder_program_name LIKE '%Deep%'
//     `);

//     const result = [];

//     for (const project of projects) {
//       const [gmData] = await db.query(`
//         SELECT * FROM planner_program_planning_gm WHERE id = ?
//       `, [project.funder_id]);

//       for (const gm of gmData) {
//         const [rmData] = await db.query(`
//           SELECT * FROM planner_program_planning_rm WHERE funder_id = ?
//         `, [gm.id]);

//         for (const rm of rmData) {
//           const [centerData] = await db.query(`
//             SELECT * FROM planner_target_gm_rm WHERE selected_rm = ?
//           `, [rm.id]);

//           for (const center of centerData) {
//             result.push({
//               project_name: project.funder_program_name,
//               vertical_name: project.vertical_name,
//               funder_id: project.funder_id,
//               gm_name: gm.first_name + ' ' + (gm.last_name || ''),
//               rm_name: rm.first_name + ' ' + (rm.last_name || ''),
//               center_code: center.member_code || center.center_code || 'N/A',
//               state: center.p_state || 'N/A',
//               q1_target: center.q1_target,
//               q2_target: center.q2_target,
//               q3_target: center.q3_target,
//               q4_target: center.q4_target,
//               total_target: center.total_target,
//               actual_target: center.actual_target
//             });
//           }
//         }
//       }
//     }

//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error('Error fetching project hierarchy data:', err);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };


exports.getProjectHierarchyData = async (req, res) => {
    try {
        const [projects] = await db.query(`
      SELECT id, funder_id, funder_program_name, vertical_name
      FROM planner_program_planning
      WHERE funder_program_name LIKE '%Diya%' OR funder_program_name LIKE '%SAVE%' OR funder_program_name LIKE '%Deep%'
    `);

        const finalData = [];

        for (const project of projects) {
            const [gms] = await db.query(`
        SELECT * FROM planner_program_planning_gm WHERE id = ?
      `, [project.funder_id]);

            for (const gm of gms) {
                const [rms] = await db.query(`
          SELECT * FROM planner_program_planning_rm WHERE gm_id = ?
        `, [gm.id]);

                for (const rm of rms) {
                    const [centers] = await db.query(`
            SELECT * FROM planner_target_gm_rm WHERE selected_rm = ?
          `, [rm.id]);

                    for (const center of centers) {
                        finalData.push({
                            project_id: project.id,
                            funder_program_name: project.funder_program_name,
                            vertical_name: project.vertical_name,
                            gm_id: gm.id,
                            gm_name: `${gm.first_name || ''} ${gm.last_name || ''}`.trim(),
                            rm_id: rm.id,
                            rm_name: `${rm.first_name || ''} ${rm.last_name || ''}`.trim(),
                            center_code: center.member_code,
                            q1_target: center.q1_target,
                            q2_target: center.q2_target,
                            q3_target: center.q3_target,
                            q4_target: center.q4_target,
                            total_target: center.total_target,
                            actual_target: center.actual_target,
                            state: center.p_state
                        });
                    }
                }
            }
        }

        res.json({ success: true, count: finalData.length, data: finalData });
    } catch (err) {
        console.error('Error fetching project hierarchy data:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};





// exports.getProjectHierarchyData = async (req, res) => {
//     try {
//         const [projects] = await db.query(`
//       SELECT id AS funder_id, funder_program_name
//       FROM planner_program_planning
//       WHERE funder_program_name IN ('Diya', 'SAVE', 'DeepTech')
//     `);

//         const result = [];

//         for (const project of projects) {
//             const [gmData] = await db.query(`
//         SELECT * FROM planner_program_planning_gm WHERE id = ?
//       `, [project.funder_id]);

//             for (const gm of gmData) {
//                 const [rmData] = await db.query(`
//           SELECT * FROM planner_program_planning_rm WHERE funder_id = ?
//         `, [gm.id]);

//                 for (const rm of rmData) {
//                     const [centerData] = await db.query(`
//             SELECT * FROM planner_target_gm_rm WHERE rm_id = ?
//           `, [rm.id]);

//                     for (const center of centerData) {
//                         result.push({
//                             project_name: project.project_name,
//                             funder_id: project.funder_id,
//                             gm_name: gm.first_name + ' ' + gm.last_name,
//                             rm_name: rm.first_name + ' ' + rm.last_name,
//                             center_code: center.member_code,
//                             q1_target: center.q1_target,
//                             q2_target: center.q2_target,
//                             q3_target: center.q3_target,
//                             q4_target: center.q4_target,
//                             total_target: center.total_target,
//                             actual_target: center.actual_target,
//                             state: center.p_state
//                         });
//                     }
//                 }
//             }
//         }

//         res.status(200).json({ success: true, data: result });
//     } catch (error) {
//         console.error('Error fetching hierarchy data:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };



exports.getAllBatches = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Count how many rows exist in planner_program_planning
    const countQuery = 'SELECT COUNT(*) AS total FROM planner_program_planning';

    // Join with planner_program_planning_gm using funder_id
    const dataQuery = `
        SELECT 
            ppp.funder_id,
            gm.*  -- Or specify columns like gm.name, gm.description, etc.
        FROM 
            planner_program_planning AS ppp
        JOIN 
            planner_program_planning_gm AS gm 
        ON 
            ppp.funder_id = gm.id
        LIMIT ? OFFSET ?
    `;

    db.query(countQuery, (err, countResult) => {
        if (err) {
            console.error('Error counting planner_program_planning:', err);
            return res.status(500).json({ error: 'Database error (count)' });
        }

        const total = countResult[0].total;

        db.query(dataQuery, [limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
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


// exports.getAllBatches = (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const countQuery = 'SELECT COUNT(*) AS total FROM batches';
//     const dataQuery = `SELECT funder_id FROM planner_program_planning LIMIT ? OFFSET ?`;

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
