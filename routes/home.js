const express = require('express');
const jwt = require('jsonwebtoken');
const envars = require('../envars.json');
const router = express.Router();

router.get('/', function(req, res) {

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Dox Home',
                    hostip: process.env.ip
                }
                res.render('home', { pagevars });
            } else {
                var pagevars = {
                    title: 'Dox Home',
                    fleetcolor: (process.env.ip == "192.168.0.107") ? "Blue" : "Green",
                    user: user
                }
                res.render('home', { pagevars });
            }
        });
    } else {
        var pagevars = {
            title: 'Dox Home',
            hostip: process.env.ip
        }
        res.render('home', { pagevars });
    }
});

module.exports = router;