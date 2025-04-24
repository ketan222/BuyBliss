const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL
  secure: true, // Set to true for port 465
  auth: {
    user: 'kittysmm0@gmail.com',
    pass:'lgjo qdgz hotz bgfa',
  },
});


const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from:"kittysmm0@gmail.com",
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
      