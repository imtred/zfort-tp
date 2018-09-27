const express = require('express');
const validator = require('express-validator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routers');
const config = require('./config');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const customValidators = require('../app/config/custom-validators');

const app = express();
const port = normalizePort(config.port);
app.set('port', port);

if (process.env.NODE_ENV === 'production') {
    config.database.logging = false;
}

app.use(bodyParser.json({ jsonLimit: '50mb' }));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(
    validator({
        customValidators
    })
);
app.use(
    session({
        secret: config.secretKey,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

/**
 * Error handler
 */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        errors: err.errors
    });
});

app.listen(port, err => {
    if (err) {
        return console.log('Server off-line', err);
    }
    console.log(`Server is listening on port ${port}`);
});

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

module.exports = app;
