const express = require('express');
const router = express.Router();

const { 
    generatePDF,
    tes
} = require('../../controller/PDFController');

 
router.get("/", generatePDF);
router.get("/tes", tes);

module.exports = router;