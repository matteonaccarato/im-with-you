const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override'); // https://www.npmjs.com/package/method-override

const app = express();

const routerPublic = require('./routes/routerPublic');
const routerAdmin = require('./routes/routerAdmin');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// With express version => 4.16.0 the body-parser middleware was added back under the methods express.urlencoded() and express.json()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
    /* app.use(methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method
            delete req.body._method
            return method
        }
    })) */

app.use(morgan('dev'));

app.use('/', routerPublic);
app.use('/admin', routerAdmin);

module.exports = app;