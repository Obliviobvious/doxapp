const express = require('express');
const db = require('../db');
const emrx = require('email-regex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const envars = require('../envars.json');
const router = express.Router();


router.get('/', (req, res) => {
    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Sign Up for Dox'
                }
                res.render('signup', {'pagevars': pagevars});
            } else {
                var pagevars = {
                    title: 'Sign Up for Dox',
                    user: user
                }
                res.render('signup', {'pagevars': pagevars});
            }
        });
    } else {
        var pagevars = {
            title: 'Sign Up for Dox'
        }
        res.render('signup', {'pagevars': pagevars});
    }
});

router.post('/', (req, res) => {

    var username = req.body.username;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var verifypass = req.body.verifypass;
    console.log(`pwd before bcrypt: ${password}`);
    //Input Validation
    if (password === verifypass || emrx().test(email)) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                throw err;
            } else {
                db.query(`INSERT INTO users (username, email, firstname, lastname, password) VALUES ('${username}', '${email}', '${firstname}', '${lastname}', '${hash}');`, (err, result, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        res.render('success');
                    }
                });
            }
        });
    } else {
        //input invalid
        res.status(500).json({message: 'Invalid Input'});

    }


});

module.exports = router;