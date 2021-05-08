const express = require('express');
const mysql = require('mysql');
const app = require('./app');

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`I'm with you ♥ | Server started on port ${PORT}`);
})

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'im_with_you',
    multipleStatements: true
});

mysqlConnection.connect(err => {
    if (!err) {
        console.log('connected')

    } else {
        console.log(err)
    }

})