const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const Pdfhtml = require('html-pdf');

const createGeneralPdf = function (args, callback) {
    const html = fs.readFileSync(args.path, 'utf8');
    const template = Handlebars.compile(html);
    const options = {
      format: 'A4',
      border: '0',
      header: {
        height: '1.5mm',
      },
      footer: {
        height: '27.5mm',
      },
      zoomFactor: '1',
      phantomPath: path.resolve(__dirname, '../../node_modules/phantomjs-prebuilt/bin/phantomjs'),
      localToRemoteUrlAccessEnabled: true,
      allowLocalFilesAccess: true
    };
    const fontPoppinsRegularPath = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Poppins-Regular.ttf'));
    const fontSemiBold = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Poppins-SemiBold.otf'));
    const fontTelkomsel = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/TelkomselBatikSans-Bold.ttf'));
    args.fontTelkomsel = fontTelkomsel.toString('base64');
    args.fontSemiBold = fontSemiBold.toString('base64');
    args.fontRegular = fontPoppinsRegularPath.toString('base64');
    const result = template(args);
    Pdfhtml.create(result, options).toBuffer(function (err, buffer) {
      if (err) {
        return callback(err);
      }
      return callback(err, buffer);
    });
  };

const generatePDF = async (req, res) => {
    try {
        const payloadFinalInvoice = {
            path: 'src/assets/FinalInvoice.html'
        }
        createGeneralPdf(payloadFinalInvoice, function (err, buffer) {
            if (err) {
                throw err;
            }
            res.type('application/pdf');
            res.setHeader('Content-Disposition','attachment; filename="' + fileName + '"');
            res.send(buffer);
          });
    } catch (error) {
        res.send(error);
    }
}

const tes = async (req, res) => {
  res.send({status: true, data: 'Tes'});
}

module.exports = {
    tes,
    generatePDF
  };