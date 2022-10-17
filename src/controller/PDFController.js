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
      orientation: 'portrait',
      dpi: 200,
      quality: 80,
      zoomFactor: '1',
      phantomPath: path.resolve(__dirname, '../../node_modules/phantomjs-prebuilt/bin/phantomjs'),
      localToRemoteUrlAccessEnabled: true,
      allowLocalFilesAccess: true
    };
    const fontPoppinsRegularPath = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Poppins-Regular.ttf'));
    const fontSemiBold = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Poppins-SemiBold.otf'));
    const fontTelkomsel = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/TelkomselBatikSans-Bold.ttf'));
    const fontOble = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Objectivity-Regular.otf'));
    args.fontTelkomsel = fontTelkomsel.toString('base64');
    args.fontSemiBold = fontSemiBold.toString('base64');
    args.fontRegular = fontPoppinsRegularPath.toString('base64');
    args.fontOble = fontOble.toString('base64');
    
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
      const tesTemplate = req.param("tes");
      const payloadFinalInvoice = {
        path: 'src/assets/FinalInvoice.html',
        projectName: 'PROJECT TEST 22',
        corporateName: 'Corporate 1',
        corporateNPWP: 'xx.xxx.xxx.x-xxx.xxx',
        amName: 'Maya Astuti',
        amEmail: 'maya.astuti@dansmultipro.com',
        addressStreetname: 'jalan kamboja',
        addressDetail: 'Jakarta Selatan , DKI Jakarta 12512',
        tanggalTagihan: '20 Jan 2022',
        nomorTagihan: ' U2912398124',
        billingCycle: '16',
        invoiceAmonth: '11,010,000',
        invoiceSubTotal: '10,000,000',
        invoicePPN: '1,000,000',
        invoiceMaterai: '10,000',
        invoiceDueDate: '03 Feb 2022',
        paymentChannel: 'Direct Debit',
        bankName: '',
        vaNumber: '',
        invoicePPh23Amount: 0,
        dateNow: '16 Oct 2022',
        terbilang: null,
        withSign: true,
        isSynergyFlag: false,
        keterangan: [],
        isPPH23: false,
        italicNoTagihan: false 
      }
      keterangan.push('Dokumen Bukti Potong dapat diupload melalui www.dsc.telkomsel.com paling lambat tanggal terakhir di bulan selanjutnya terhitung setelah payment dilakukan.');
      keterangan.push('PPN dan atau PPnBM tidak dipungut berdasarkan PP No.27 Tahun 2017');
      
      if (tesTemplate) {
        payloadFinalInvoice.path = 'src/assets/Test.html'
      }
        const fileName = 'tes.pdf';
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