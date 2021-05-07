const express = require('express');

const app = express();

const routerPublic = require('./routes/routerPublic');
const routerAdmin = require('./routes/routerAdmin');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use('/', routerPublic);
app.use('/admin', routerAdmin);

module.exports = app;