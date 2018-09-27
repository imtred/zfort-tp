const express = require('express');
const app = express();
const auth = require('./auth-router');
const users = require('./users-router');

app.use('', auth);
app.use('/user', users);

module.exports = app;
