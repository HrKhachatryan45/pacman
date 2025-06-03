const nodemailer = require("nodemailer");

const sendEmail = async (emailToSendTo,subject,messageHTML) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: emailToSendTo,
        subject:subject,
        html:messageHTML
    }
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail