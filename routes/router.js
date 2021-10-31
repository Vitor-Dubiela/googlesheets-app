const express = require('express');

const MetadataController = require('../controllers/MetadataController');

const dataController = new MetadataController();
const router = express.Router();

router.get('/metadata', dataController.getSheetData);

module.exports = app => app.use('/app', router);