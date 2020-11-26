const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const envars = require('../envars.json');
const router = express.Router();

router.get('/', function(req, res) {
    
    if (req.query.from && req.query.from == 'authfailed') {
        var pagevars = {
            title: 'Dashboard',
            authfailed: true
        }
        res.render('login', { pagevars });
    } else {
        var atoken = req.cookies.authtoken;
        //read cookie and verify jwt token
        if (atoken) {
            jwt.verify(atoken, envars.jwtkey, (err, user) => {
                if (err) {
                    var pagevars = {
                        title: 'Login to Dox',
                        authfailed: false
                    }
                    res.render('login', { pagevars });
                } else {
                    var pagevars = {
                        title: 'Dashboard',
                        user: user
                    }
                    res.render('dashboard', { pagevars });
                }
            });
        } else {
            var pagevars = {
                title: 'Login to Dox',
                authfailed: false
            }
            res.render('login', { pagevars });
        }
    }

});

router.post('/', (req, res) => {

    var uname = req.body.username;
    var pwd = req.body.password;

    //query users
    var q = db.query(`SELECT * FROM users where username = ?`, [uname], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 1) {
            user = rows[0];
            bcrypt.compare(pwd, user.password, (err, r) => {
                if (r) {
                    //create token
                    const token = jwt.sign(
                        {
                            userid: user.userid,
                            username: user.username,
                            firstname: user.firstname
                        },
                        envars.jwtkey,
                        {
                            expiresIn: "3h"
                        }
                    );
                    //set authtoken cookie to the jwt token
                    res.cookie('authtoken', token);
                    res.redirect('/dashboard');
                } else {
                    //reprompt -- failed password
                    res.redirect('/login/?from=authfailed');
                }
            });
        } else {
            //reprompt -- failed username
            res.redirect('/login/?from=authfailed');
        }
    });
});

module.exports = router;