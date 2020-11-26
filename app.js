var express = require('express');
var pug = require('pug');
var path = require('path');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var mysql = require('mysql');
var servefavicon = require('serve-favicon');
var morgan = require('morgan');
var app = express();

//Set Routes
var homeRoutes = require('./routes/home.js');
var loginRoutes = require('./routes/login.js');
var dashRoutes = require('./routes/dashboard.js');
var signupRoutes = require('./routes/signup.js');
var aboutRoutes = require('./routes/about.js');
var recoveryRoutes = require('./routes/recovery.js');
var accountRoutes = require('./routes/account.js');

//Set Global Vars
var port = 80;

app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(cookieparser());
app.use(express.static(path.join(__dirname + '/public')));
app.use(servefavicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        res.status(200).json({});
    }
    next();
});

//Route Stuff
app.use('/', homeRoutes);
app.use('/home', homeRoutes);
app.use('/login', loginRoutes);
app.use('/dashboard', dashRoutes);
app.use('/signup', signupRoutes);
app.use('/about', aboutRoutes);
app.use('/recovery', recoveryRoutes);
app.use('/account', accountRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;