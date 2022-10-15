const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PDFRoute = require('./PDF');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(cors());

// Inisialisasi Route Path
app.use("/pdf", PDFRoute)

module.exports = app;