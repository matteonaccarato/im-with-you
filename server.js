const express = require('express');
const app = require('./app');

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`I'm with you ♥ | Server started on port ${PORT}`);
})