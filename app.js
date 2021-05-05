const express = require('express');

const app = express();

const routerPublic = require('./routes/routerPublic');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/', routerPublic);

module.exports = app;