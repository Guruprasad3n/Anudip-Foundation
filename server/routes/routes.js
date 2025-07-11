const express = require('express');
const router = express.Router();
const {
  getRMWiseData,
  getPMOWiseData,
  getStateCenters,
  getBatchesByState,
  verticalRMData
} = require('../controllers/controllers');

router.get('/state/:state/centers', getStateCenters);
router.get('/rm', getRMWiseData);
router.get('/state/:stateName/batches', getBatchesByState);
router.get('/pmo', getPMOWiseData);
router.get('/:verticalName', verticalRMData)                   

module.exports = router;