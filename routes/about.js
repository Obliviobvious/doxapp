const express = require('express');
// const jwt = require('jsonwebtoken');
// const envars = require('../envars.json');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('about');
});

module.exports = router;