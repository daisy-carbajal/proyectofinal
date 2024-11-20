const { poolPromise, sql } = require("../database/db");

const createUserRole = async (req, res) => {
  try {
    const { UserID, RoleID, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("RoleID", sql.Int, RoleID)
      .input("CreatedBy", sql.NVarChar, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddUserRole"); 

    res.status(201).json({ message: "Relación de usuario y rol creada exitosamente" });
  } catch (err) {
    console.error("Error al crear la relación de usuario y rol:", err);
    res.status(500).json({ message: "Error al crear la relación de usuario y rol" });
  }
};

const getAllUserRoles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllUserRoles"); 

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las relaciones de usuario y rol:", err);
    res.status(500).json({ message: "Error al obtener las relaciones de usuario y rol" });
  }
};

const getUserRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
      .input("UserRoleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetUserRoleById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Relación de usuario y rol no encontrada" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener la relación de usuario y rol:", err);
    res.status(500).json({ message: "Error al obtener la relación de usuario y rol" });
  }
};

const updateStartDateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { StartDate } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("UserRoleID", sql.Int, id)
      .input("StartDate", sql.Int, StartDate)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateStartDateUserRole");

    res.status(200).json({ message: "Relación de usuario y rol actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar la relación de usuario y rol:", err);
    res.status(500).json({ message: "Error al actualizar la relación de usuario y rol" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { UserID, RoleID } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const checkActiveRole = await pool.request()
      .input("UserID", sql.Int, UserID)
      .execute("CheckActiveRole");

    if (checkActiveRole.recordset.length > 0) {
      await pool.request()
        .input("UserID", sql.Int, UserID)
        .input("UpdatedBy", sql.Int, RequesterID)
        .execute("DeactivateActiveRole");
    }

    await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("RoleID", sql.Int, RoleID)
      .input("CreatedBy", sql.Int, RequesterID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddUserRole");

    res.status(201).json({ message: "Relación de usuario y rol actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar la relación de usuario y rol:", err);
    res.status(500).json({ message: "Error al actualizar la relación de usuario y rol" });
  }
};

module.exports = {
  createUserRole,
  getAllUserRoles,
  getUserRoleById,
  updateStartDateUserRole,
  updateUserRole
};