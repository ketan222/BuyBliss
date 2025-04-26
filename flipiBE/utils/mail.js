const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL
  secure: true, // Set to true for port 465
  auth: {
    user: `${process.env.MAIL_USER}`,
    pass:`${process.env.MAIL_PASS}`,
  },
});


const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from:`${process.env.MAIL_USER}`,
    to,
    subject,
    text,
    html,
  };

  try {
    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASS);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    const info = await transporter.sendMail(mailOptions);       
    console.log("✅ Email Sent: ", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendMail };
      