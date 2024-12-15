const nodemailer = require("nodemailer");
require("dotenv").config();

const sendPasswordResetEmail = async (email, resetLink, tempPassword) => {
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
      subject: "Restablecimiento de Contraseña",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <title>Restablecimiento de Contraseña</title>
          <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            table, td, div, h1, p { font-family: 'Lexend', sans-serif; }
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
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;color:#3eb01d;">Restablecimiento de Contraseña</h1>
                        <p style="margin:0;">Hemos recibido una solicitud para restablecer su contraseña. Use la siguiente contraseña temporal para iniciar sesión y restablecer su contraseña:</p>
                        <p style="font-size:18px; font-weight:bold; color:#3eb01d;">${tempPassword}</p>
                        <p>Si no hizo esta solicitud, ignore este mensaje. De lo contrario, haga clic en el enlace a continuación para establecer una nueva contraseña:</p>
                        <p style="margin:0;">
                          <a href="${resetLink}" style="color:#3eb01d;text-decoration:underline;font-weight:bold;">
                            Restablecer Contraseña
                          </a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:35px 30px;background-color:#ffffff;">
                        <p>El enlace expirará en 1 hora.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;">Si tiene alguna pregunta o necesita ayuda, no dude en contactarnos.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                        <p style="margin:0;">El Equipo de SGHR💚</p>
                        </p>
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
    console.log("Correo de restablecimiento enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
  }
};

module.exports = { sendPasswordResetEmail };