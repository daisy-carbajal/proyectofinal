const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../database/db");
const {
  sendPasswordResetEmail,
} = require("../services/sendPasswordResetEmail");

const login = async (req, res) => {
  try {
    const { workEmail, password, rememberMe } = req.body;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("WorkEmail", sql.NVarChar, workEmail)
      .output("Password", sql.NVarChar)
      .output("UserID", sql.Int)
      .output("RoleID", sql.Int) // Agrega el RoleID como output
      .output("Status", sql.Bit)
      .execute("LogInUser");

    if (result.returnValue === 1) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const validPassword = await bcrypt.compare(
      password,
      result.output.Password
    );
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const tokenExpiration = rememberMe ? "30d" : "1h";
    const token = jwt.sign(
      { id: result.output.UserID, roleId: result.output.RoleID }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiration }
    );

    await createSessionToken(result.output.UserID, token);

    res.cookie("token", token, {
      httpOnly: true, // Protege contra ataques XSS
      secure: process.env.NODE_ENV === "production", // Solo usa HTTPS en producción
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30 días o 1 hora
      sameSite: "strict", // Previene ataques CSRF
    });

    res.json({
      message: "Login exitoso",
      token,
      userId: result.output.UserID,
      roleId: result.output.RoleID, // Incluye el RoleID en la respuesta
    });
  } catch (err) {
    res.status(500).send("Error en el login");
    console.error(err);
  }
};

const getUserFirstandLastName = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetUserFirstandLastName");

    const { FirstName, LastName } = result.recordset[0];
    res.json({ firstName: FirstName, lastName: LastName });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).send("Server error");
  }
};

const createSessionToken = async (userId, token) => {
  console.log("Valor de UserID en el backend:", userId);
  if (isNaN(userId)) {
    console.error("UserID no es un número válido:", userId);
    return;
  }

  const pool = await poolPromise;
  await pool
    .request()
    .input("UserID", sql.Int, userId)
    .input("Token", sql.NVarChar, token)
    .input(
      "TokenExpiration",
      sql.DateTime,
      new Date(Date.now() + 60 * 60 * 1000)
    )
    .execute("AddSessionToken");
};

const logoutUser = async (req, res) => {
  const { token } = req.body;
  const pool = await poolPromise;

  await pool
    .request()
    .input("Token", sql.NVarChar, token)
    .execute("LogoutUser");

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

  res.status(200).json({ message: "Sesión cerrada correctamente" });
};

const requestPasswordReset = async (req, res) => {
  try {
    const { personalEmail } = req.body;
    const pool = await poolPromise;

    const userCheck = await pool
      .request()
      .input("PersonalEmail", sql.NVarChar, personalEmail)
      .execute("CheckIfEmailExists");

    if (userCheck.recordset[0].EmailCount === 0) {
      return res.status(404).json({ message: "Correo personal no encontrado" });
    }

    const result = await pool
      .request()
      .input("PersonalEmail", sql.NVarChar, personalEmail)
      .execute("RequestPasswordReset");

    const resetToken = result.recordset[0]?.ResetToken;
    const tempPassword = result.recordset[0]?.TempPassword;

    if (resetToken && tempPassword) {
      const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

      await pool
        .request()
        .input("PersonalEmail", sql.NVarChar, personalEmail)
        .input("Password", sql.NVarChar, hashedTempPassword)
        .execute("UpdateUserPassword");

      const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

      await sendPasswordResetEmail(personalEmail, resetLink, tempPassword);

      return res
        .status(200)
        .json({ message: "Correo de restablecimiento enviado" });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    return res
      .status(500)
      .json({ message: "Error al solicitar restablecimiento de contraseña" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, tempPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Token", sql.NVarChar, token)
      .execute("GetUserByPasswordResetToken");

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const validTempPassword = await bcrypt.compare(tempPassword, user.Password);
    if (!validTempPassword) {
      return res
        .status(400)
        .json({ message: "Contraseña temporal incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool
      .request()
      .input("UserID", sql.Int, user.UserID)
      .input("NewPassword", sql.NVarChar, hashedPassword)
      .execute("ResetPassword");

    res.status(200).json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

const validateToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: "Token no encontrado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ valid: false, message: "Token inválido o expirado" });
    }
    res.status(200).json({ valid: true, user });
  });
};

module.exports = {
  login,
  getUserFirstandLastName,
  createSessionToken,
  requestPasswordReset,
  resetPassword,
  logoutUser,
  validateToken,
};
