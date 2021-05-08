const express = require('express');
const morgan = require('morgan');

const app = express();

const routerPublic = require('./routes/routerPublic');
const routerAdmin = require('./routes/routerAdmin');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use('/', routerPublic);
app.use('/admin', routerAdmin);

module.exports = app;