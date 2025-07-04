const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');


router.get('/data', batchController.getAllBatches);
router.get('/project-hierarchy', batchController.getProjectHierarchyData);
router.get('/members', batchController.getMembers);
router.get('/data/:id', batchController.getBatchById);

module.exports = router;
