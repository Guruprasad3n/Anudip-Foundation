const express = require('express');
const router = express.Router();
const {
  getRMWiseData,
  getPMOWiseData,
  getStateCenters,
  getBatchesByState
} = require('../controllers/controllers');

router.get('/state/:state/centers', getStateCenters);        // Center-wise View
router.get('/rm', getRMWiseData);                            // RM-wise View
router.get('/state/:stateName/batches', getBatchesByState);  // Batch-wise View
router.get('/pmo', getPMOWiseData);                          // PMO-level View

module.exports = router;











// const express = require('express');
// const router = express.Router();
// const {
//     getRMWiseData,
//     getPMOWiseData,
//     getStateCenters,
//     getBatchesByState
// } = require('../controllers/controllers');


// router.get("/state/:state/centers", getStateCenters);
// router.get('/rm', getRMWiseData);
// router.get("/state/:stateName/batches", getBatchesByState);
// router.get("/pmo", getPMOWiseData);

// module.exports = router;










// router.get('/project-hierarchy', getProjectHierarchy);
// router.get('/project', getProjectWiseData);
// router.get('/pradip', getRmWiseData);

///////////////////////
// router.get('/center', getCenterWiseData);
// router.get('/batch', getBatchWiseData);

// router.get('/quarter', getQuarterWiseData);


///////////////////////////////////////////
// getCenterWiseData,
// getBatchWiseData,
// getQuarterWiseData,
// getRmWiseData,
// getProjectWiseData,
// getProjectHierarchy,