const nodemailer = require("nodemailer");

export function getMailTransporter() {
  const mailerEmail: string | undefined = process.env.MAILER_EMAIL;
  const mailerPassword: string | undefined = process.env.MAILER_PASSWORD;

  return nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    service: "yahoo",
    secure: false,
    auth: {
      user: mailerEmail,
      pass: mailerPassword,
    }
  });
}
