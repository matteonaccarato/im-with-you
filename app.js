const express = require('express');
const morgan = require('morgan');

const app = express();

const routerPublic = require('./routes/routerPublic');
const routerAdmin = require('./routes/routerAdmin');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// With express version => 4.16.0 the body-parser middleware was added back under the methods express.urlencoded() and express.json()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('dev'));

app.use('/', routerPublic);
app.use('/admin', routerAdmin);

module.exports = app;