const express = require('express');
const router = express.Router();

const docs = require("./docs");
const employees = require("./employees");
const module_lists = require("./module-lists");

router.use('/docs', docs);
router.use('/employees', employees);
router.use('/module-lists', module_lists);

module.exports = router;