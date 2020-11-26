const express = require('express');
// const jwt = require('jsonwebtoken');
// const envars = require('../envars.json');
const router = express.Router();

router.get('/', function(req, res) {

    var atoken = req.cookies.authtoken;
    //read cookie and verify jwt token
    if (atoken) {
        jwt.verify(atoken, envars.jwtkey, (err, user) => {
            if (err) {
                var pagevars = {
                    title: 'Dox Home'
                }
                res.render('home', { pagevars });
            } else {
                //QUERY FOR USER ACC DETAILS
                var pagevars = {
                    title: 'Dox Home',
                    user: user
                }
                res.render('account', { pagevars });
            }
        });
    } else {
        var pagevars = {
            title: 'Dox Home'
        }
        res.render('home', { pagevars });
    }
});

module.exports = router;