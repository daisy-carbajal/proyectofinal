const { poolPromise, sql } = require("../database/db");

const createUserRole = async (req, res) => {
  try {
    const { UserID, RoleID } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("RoleID", sql.Int, RoleID)
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
    const result = await pool.request().execute("GetAllUserRoles"); 

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
    const result = await pool.request()
      .input("UserRoleID", sql.Int, id)
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
    const pool = await poolPromise;

    await pool.request()
      .input("UserRoleID", sql.Int, id)
      .input("StartDate", sql.Int, StartDate)
      .execute("UpdateStartDateUserRole");

    res.status(200).json({ message: "Relación de usuario y rol actualizada exitosamente" });
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
};