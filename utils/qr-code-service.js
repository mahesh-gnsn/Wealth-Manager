const QRCode = require('qrcode');
const fs = require('fs');
const AWS = require('aws-sdk');

//Function to generate QR Code
async function generateQrCode(uniqueId) {
//     const qrResponse = await QRCode.toDataURL(uniqueId);
//     fs.writeFileSync('./qr.html', `<img src="${qrResponse}">`);
//   console.log('Wrote to ./qr.html');
    // QRCode.toDataURL('This is Test!', function (err, url) {
    //     console.log(url);
    //     return (url);
    // })
    return '';
}

module.exports.generateQrCodeUrl = generateQrCode;