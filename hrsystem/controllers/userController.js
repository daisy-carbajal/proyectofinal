const { poolPromise, sql } = require("../database/db");
const crypto = require("crypto");
const { sendInvitationEmail } = require("../services/sendInvitationEmail");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const csv = require("csv-parser");
const streamifier = require("streamifier");

let pool;

(async () => {
  pool = await poolPromise;
})();

const generateRandomPassword = (length = 8) => {
  return Math.random().toString(36).slice(-length);
};

const createUser = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      PersonalEmail,
      BirthDate,
      Gender,
      PhoneNumber,
      TaxID,
      StreetAddress,
      City,
      State,
      PostalCode,
      Country,
      JobTitleID,
      DepartmentID,
      CreatedBy,
      ManagerID,
    } = req.body;
    const RequesterID = req.userId;

    const tempPassword = generateRandomPassword();
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const result = await pool
      .request()
      .input("FirstName", sql.NVarChar, FirstName)
      .input("LastName", sql.NVarChar, LastName)
      .input("PersonalEmail", sql.NVarChar, PersonalEmail)
      .input("Password", sql.NVarChar, hashedTempPassword)
      .input("BirthDate", sql.Date, BirthDate)
      .input("Gender", sql.NVarChar, Gender)
      .input("PhoneNumber", sql.NVarChar, PhoneNumber)
      .input("TaxID", sql.NVarChar, TaxID)
      .input("StreetAddress", sql.NVarChar, StreetAddress)
      .input("City", sql.NVarChar, City)
      .input("State", sql.NVarChar, State)
      .input("PostalCode", sql.NVarChar, PostalCode)
      .input("Country", sql.NVarChar, Country)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddUser");

    const userId = result.recordset[0].UserID;

    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("StartDate", sql.Date, new Date())
      .input("ChangeReasonID", sql.Int, 4)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddNewJobTitleChange");

    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("StartDate", sql.Date, new Date())
      .input("ChangeReasonID", sql.Int, 4)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddNewDepartmentChange");

    const roleResult = await pool
      .request()
      .input("JobTitleID", sql.Int, JobTitleID)
      .execute("GetRoleByJobTitle");

    const roleId = roleResult.recordset[0].RoleID;

    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("RoleID", sql.Int, roleId)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddUserRole");

    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("ManagerID", sql.Int, ManagerID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddNewUserHierarchy");

    await pool
    .request()
    .input("UserID", sql.Int, userId)
    .execute("AddUserPreferences");

    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("Token", sql.NVarChar, token)
      .input(
        "TokenExpiration",
        sql.DateTime,
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      )
      .input("CreatedBy", sql.Int, CreatedBy)
      .execute("AddUserInvitationToken");

    sendInvitationEmail(PersonalEmail, token, tempPassword);

    res
      .status(201)
      .json({ message: "Usuario creado y correo de invitación enviado" });
  } catch (err) {
    if (
      err.originalError &&
      err.originalError.info &&
      err.originalError.info.message.includes(
        "El correo electrónico ya está en uso"
      )
    ) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }
    res.status(500).send("Error al crear el usuario.");
    console.error(err);
  }
};

const resendToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { CreatedBy } = req.body;
    const tempPassword = generateRandomPassword();
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("Password", sql.NVarChar, hashedTempPassword)
      .input("UpdatedBy", sql.Int, CreatedBy)
      .execute("UpdateTempPassword");

    const emailResult = await pool
      .request()
      .input("UserID", sql.Int, id)
      .execute("GetUserEmail");

    const personalEmail = emailResult.recordset[0].PersonalEmail;

    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("Token", sql.NVarChar, token)
      .input(
        "TokenExpiration",
        sql.DateTime,
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      )
      .input("CreatedBy", sql.Int, CreatedBy)
      .execute("AddUserInvitationToken");

    sendInvitationEmail(personalEmail, token, tempPassword);

    res
      .status(201)
      .json({ message: "Correo de invitación enviado nuevamente." });
  } catch (err) {
    {
      return res.status(400).json({
        message: "Error el re-enviar correo de invitación.",
        error: err,
      });
    }
  }
};

const completeRegistration = async (req, res) => {
  try {
    const { token, tempPassword, newPassword, confirmPassword } = req.body;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Token", sql.NVarChar, token)
      .execute("CheckUserToken");

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const userId = result.recordset[0].UserID;
    const storedTempPassword = result.recordset[0].TempPassword; // Asumimos que la columna existe

    const isTempPasswordValid = await bcrypt.compare(
      tempPassword,
      storedTempPassword
    );
    if (!isTempPasswordValid) {
      return res
        .status(400)
        .json({ message: "Contraseña temporal incorrecta" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Las nuevas contraseñas no coinciden" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("InvitationToken", sql.NVarChar, token)
      .input("Password", sql.NVarChar, hashedPassword)
      .execute("CompleteUserRegistration");

    res.json({ message: "Registro completado. Ahora puedes iniciar sesión" });
  } catch (err) {
    res.status(500).send("Error al completar el registro");
    console.error(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllUsers");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).send("Error al obtener los usuarios");
  }
};

const getAllUsersWithoutLoggedUser = async (req, res) => {
  try {
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllUsersWithoutLoggedUser");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).send("Error al obtener los usuarios");
  }
};

const getAllUserDetails = async (req, res) => {
  try {
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetUserDetails");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).send("Error al obtener los usuarios");
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      FirstName,
      LastName,
      PersonalEmail,
      BirthDate,
      PhoneNumber,
      UpdatedBy,
    } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("FirstName", sql.NVarChar, FirstName)
      .input("LastName", sql.NVarChar, LastName)
      .input("PersonalEmail", sql.NVarChar, PersonalEmail)
      .input("BirthDate", sql.Date, BirthDate)
      .input("PhoneNumber", sql.NVarChar, PhoneNumber)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateUser");

    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteUser");

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    res.status(500).send("Error al eliminar el usuario");
    console.error(err);
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateUser");

    res.json({ message: "Usuario borrado exitosamente" });
  } catch (err) {
    res.status(500).send("Error al borrar el usuario");
    console.error(err);
  }
};

const requiredColumns = [
  "FirstName",
  "LastName",
  "PersonalEmail",
  "BirthDate",
  "Gender",
  "PhoneNumber",
  "TaxID",
  "StreetAddress",
  "City",
  "State",
  "PostalCode",
  "Country",
  "JobTitleID",
  "DepartmentID",
];

const importUsersFromCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Por favor, sube un archivo CSV" });
  }

  const createdBy = req.body.createdBy;
  const RequesterID = req.userId;

  try {
    const users = [];
    const stream = streamifier.createReadStream(req.file.buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("headers", (headers) => {
          const missingColumns = requiredColumns.filter(
            (col) => !headers.includes(col)
          );
          if (missingColumns.length > 0) {
            reject(
              `El archivo CSV no tiene todas las columnas necesarias. Faltan: ${missingColumns.join(
                ", "
              )}`
            );
          }
        })
        .on("data", (row) => {
          users.push({
            FirstName: row.FirstName,
            LastName: row.LastName,
            PersonalEmail: row.PersonalEmail,
            BirthDate: row.BirthDate,
            Gender: row.Gender,
            PhoneNumber: row.PhoneNumber,
            TaxID: row.TaxID,
            StreetAddress: row.StreetAddress,
            City: row.City,
            State: row.State,
            PostalCode: row.PostalCode,
            Country: row.Country,
            JobTitleID: row.JobTitleID,
            DepartmentID: row.DepartmentID,
            CreatedBy: createdBy,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      for (const user of users) {
        console.log("Datos del usuario a insertar:", user);
        const result = await transaction
          .request()
          .input("FirstName", sql.NVarChar, user.FirstName)
          .input("LastName", sql.NVarChar, user.LastName)
          .input("PersonalEmail", sql.NVarChar, user.PersonalEmail)
          .input("BirthDate", sql.Date, user.BirthDate)
          .input("Gender", sql.NVarChar, user.Gender)
          .input("PhoneNumber", sql.NVarChar, user.PhoneNumber)
          .input("TaxID", sql.NVarChar, user.TaxID)
          .input("StreetAddress", sql.NVarChar, user.StreetAddress)
          .input("City", sql.NVarChar, user.City)
          .input("State", sql.NVarChar, user.State)
          .input("PostalCode", sql.NVarChar, user.PostalCode)
          .input("Country", sql.NVarChar, user.Country)
          .input("CreatedBy", sql.Int, user.CreatedBy)
          .input("RequesterID", sql.Int, RequesterID)
          .execute("AddUser");

        const userId = result.recordset[0].UserID;

        await transaction
          .request()
          .input("UserID", sql.Int, userId)
          .input("JobTitleID", sql.Int, user.JobTitleID)
          .input("StartDate", sql.Date, new Date())
          .input("EndDate", sql.Date, null)
          .input("CreatedBy", sql.Int, user.CreatedBy)
          .input("RequesterID", sql.Int, RequesterID)
          .execute("AddJobTitleChange");

        await transaction
          .request()
          .input("UserID", sql.Int, userId)
          .input("DepartmentID", sql.Int, user.DepartmentID)
          .input("StartDate", sql.Date, new Date())
          .input("EndDate", sql.Date, null)
          .input("CreatedBy", sql.Int, user.CreatedBy)
          .input("RequesterID", sql.Int, RequesterID)
          .execute("AddDepartmentChange");

        const roleResult = await transaction
          .request()
          .input("JobTitleID", sql.Int, user.JobTitleID)
          .input("RequesterID", sql.Int, RequesterID)
          .execute("GetRoleByJobTitle");

        const roleId = roleResult.recordset[0]?.RoleID;

        if (roleId) {
          await transaction
            .request()
            .input("UserID", sql.Int, userId)
            .input("RoleID", sql.Int, roleId)
            .input("RequesterID", sql.Int, RequesterID)
            .execute("AddUserRole");
        }

        const token = crypto.randomBytes(32).toString("hex");
        await transaction
          .request()
          .input("UserID", sql.Int, userId)
          .input("Token", sql.NVarChar, token)
          .input(
            "TokenExpiration",
            sql.DateTime,
            new Date(Date.now() + 24 * 60 * 60 * 1000)
          )
          .input("IsUsed", sql.Bit, 0)
          .execute("AddUserInvitationToken");

        sendInvitationEmail(user.PersonalEmail, token);
      }

      await transaction.commit();
      res.status(200).json({ message: "Usuarios importados exitosamente" });
    } catch (err) {
      await transaction.rollback();
      console.error("Error durante la transacción:", err);
      res
        .status(500)
        .json({ message: "Error al importar usuarios a la base de datos" });
    }
  } catch (err) {
    console.error("Error al procesar el archivo CSV:", err);
    res.status(500).json({ message: "Error al procesar el archivo CSV" });
  }
};

const updateUserField = async function (req, res) {
  const { id } = req.params;
  const { fieldName, newValue } = req.body;
  const RequesterID = req.userId;

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("FieldName", sql.NVarChar, fieldName)
      .input("NewValue", sql.NVarChar, newValue)
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateUserField");

    if (result.rowsAffected[0] > 0) {
      res
        .status(200)
        .json({ message: `Campo '${fieldName}' actualizado correctamente.` });
    } else {
      res.status(404).json({
        message: `El campo '${fieldName}' no existe o el usuario no fue encontrado.`,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el campo en la tabla User." });
  }
};

const getUserDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetUserDetailsById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener detalles de usuario por ID:", err);
    res.status(500).json({ message: "Error al obtener detalles de usuario" });
  }
};

const getManagerUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetManagerUsers");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener detalles de usuario por ID:", err);
    res.status(500).json({ message: "Error al obtener detalles de usuario" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getAllUserDetails,
  getUserDetailsById,
  resendToken,
  completeRegistration,
  updateUser,
  updateUserField,
  deactivateUser,
  deleteUser,
  importUsersFromCSV,
  getAllUsersWithoutLoggedUser,
  getManagerUsers,
};
