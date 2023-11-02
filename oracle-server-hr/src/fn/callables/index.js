const express = require('express');
const router = express.Router();

const accounts = require("./accounts");
const get = require("./get");
const triggeredEvents = require("./triggered-events");

router.use('/accounts', accounts);
router.use('/get', express.text({type: '*/*', limit: "200mb"}), get);

router.use('/triggered-events', triggeredEvents);

module.exports = router;