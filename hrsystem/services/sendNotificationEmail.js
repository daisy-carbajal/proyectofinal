const nodemailer = require("nodemailer");
require("dotenv").config();

const sendNotificationEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Outlook",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Nueva Evaluación Creada",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <title>Notificación de Evaluación</title>
          <style>
            table, td, div, h1, p { font-family: Arial, sans-serif; }
            @media screen and (max-width: 530px) {
              .col-lge { max-width: 100% !important; }
            }
            @media screen and (min-width: 531px) {
              .col-sml { max-width: 27% !important; }
              .col-lge { max-width: 73% !important; }
            }
          </style>
        </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#f4f4f4;">
          <div role="article" lang="en" style="background-color:#f4f4f4;">
            <table role="presentation" style="width:100%;border:none;border-spacing:0;">
              <tr>
                <td align="center" style="padding:0;">
                  <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;">
                    <tr>
                      <td style="padding:40px 30px 30px 30px;text-align:center;">
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;color:#333;">Nueva Evaluación Creada</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;font-size:16px;color:#555;">
                          ${message}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;font-size:14px;color:#888;">
                          Si tiene alguna pregunta, no dude en ponerse en contacto con el equipo de soporte.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;text-align:center;font-size:12px;background-color:#333;color:#ffffff;">
                        <p style="margin:0;">Sistema de Evaluaciones</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = { sendNotificationEmail };