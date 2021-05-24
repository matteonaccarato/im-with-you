const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = require('./app');

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`I'm with you ♥ | Server started on port ${PORT}`);
})