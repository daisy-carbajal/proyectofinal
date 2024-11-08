const nodemailer = require("nodemailer");
require("dotenv").config();

const sendInvitationEmail = async (email, token, tempPassword) => {
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
      subject: "¡Bienvenido!🎉",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <title>Complete su registro</title>
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
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
          <div role="article" lang="en" style="background-color:#939297;">
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
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;">¡Bienvenido!</h1>
                        <p style="margin:0;">Por favor, haga clic en el enlace a continuación para completar su registro:</p>
                        <p style="margin:0;">
                          <a href="http://localhost:4200/complete-registration?token=${token}" style="color:#e50d70;text-decoration:underline;">
                            Completar registro
                          </a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:35px 30px;background-color:#ffffff;">
                        <h2 style="font-size:20px;line-height:26px;">Su contraseña temporal:</h2>
                        <p style="font-size:18px;font-weight:bold;color:#e50d70;">${tempPassword}</p>
                        <p>Utilice esta contraseña temporal para iniciar sesión por primera vez y, a continuación, podrá cambiarla.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;">Si tiene alguna pregunta o necesita ayuda, no dude en contactarnos.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                        <p style="margin:0 0 8px 0;">
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
    console.log("Correo enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = { sendInvitationEmail };
