const express = require('express');
const app = express();
const index = require('./v1');

app.use('/api/v1', index);

module.exports = app;
