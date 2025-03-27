import nodemailer from "nodemailer";

export const sendMailOTP = async (email: string, OTP:string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mail.sudeep2024@gmail.com",
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "mail.sudeep2024@gmail.com",
    to: email,
    subject: `One Time Password for Admin`,
    text: `You are assigned as Admin for the Student Academic System and your OTP is ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return error.message;
    } else {
      console.log("Email sent: ", info.response);
    }
  });

};

export const sendMailMessage = async (email:string, message:string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mail.sudeep2024@gmail.com",
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "mail.sudeep2024@gmail.com",
    to: email,
    subject: "Student Academic System Message",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return error.message;
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}
