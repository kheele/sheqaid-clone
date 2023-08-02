const express = require('express');
const router = express.Router();

const accounts = require("./accounts");
const get = require("./get");

router.use('/accounts', accounts);
router.use('/get', express.text({type: '*/*', limit: "200mb"}), get);

module.exports = router;