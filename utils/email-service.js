const nodemailer = require('nodemailer');
const { Logger } = require('./logger');
const logger = new Logger(process.env.logLevel)

module.exports = async function (email) {
    const sixDigitRandom = Math.floor(100000 + Math.random() * 900000);
    
    try {
        const smtpEndpoint = process.env.SMTP_ENDPOINT;
        const port = process.env.SMTP_PORT;
        const senderAddress = process.env.SMTP_FROM_ADDRESS;
        const toAddress = email;

        const smtpUsername = process.env.SMTP_USERNAME;
        const smtpPassword = process.env.SMTP_PASSWORD;
        const subject = "OTP for FasTest";
        const body_text = `Your FasTest account verification code is <b>${sixDigitRandom}</b>. Please use this to verify your email address.<br><br>Team FasTest.<br><br><br><b>Note:</b> This is a system generated message, please do not reply to it.`;

        // Create the SMTP transport.
        let transporter = nodemailer.createTransport({
            host: smtpEndpoint,
            port: port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtpUsername,
                pass: smtpPassword
            }
        });
        // Specify the fields in the email.
        let mailOptions = {
            from: senderAddress,
            to: toAddress,
            subject: subject,
            html: body_text
        };

        // Send the email.
        logger.debug(`Trying to send an email with otp ${sixDigitRandom} to ${JSON.stringify(mailOptions)}`);
        const info = await transporter.sendMail(mailOptions);
        return { ...info, sixDigitRandom };
    } catch (exception) {
        logger.error(exception.message);
        return false;
    }
}