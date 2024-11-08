const { poolPromise, sql } = require("../database/db");

const createWarningLevel = async (req, res) => {
  try {
    const { WarningLevel } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("WarningLevel", sql.NVarChar, WarningLevel)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddDisciplinaryActionWarningLevel");

    res.status(201).json({ message: "Nivel de advertencia creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el nivel de advertencia:", err);
    res.status(500).json({ message: "Error al crear el nivel de advertencia" });
  }
};

const getAllWarningLevels = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllDisciplinaryActionWarningLevels"); 

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los niveles de advertencia:", err);
    res.status(500).json({ message: "Error al obtener los niveles de advertencia" });
  }
};

const getWarningLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
      .input("WarningLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetDisciplinaryActionWarningLevelById"); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Nivel de advertencia no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el nivel de advertencia:", err);
    res.status(500).json({ message: "Error al obtener el nivel de advertencia" });
  }
};

const updateWarningLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { WarningLevel } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("WarningLevelID", sql.Int, id)
      .input("WarningLevel", sql.NVarChar, WarningLevel)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateDisciplinaryActionWarningLevel"); 

    res.status(200).json({ message: "Nivel de advertencia actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el nivel de advertencia:", err);
    res.status(500).json({ message: "Error al actualizar el nivel de advertencia" });
  }
};

const deleteWarningLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool.request()
      .input("WarningLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteDisciplinaryActionWarningLevel");

    res.status(200).json({ message: "Nivel de advertencia eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el nivel de advertencia:", err);
    res.status(500).json({ message: "Error al eliminar el nivel de advertencia" });
  }
};

const deactivateWarningLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("WarningLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateDisciplinaryActionWarningLevel");

    res.status(200).json({ message: "Nivel de advertencia de acción disciplinaria desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar el nivel de advertencia de acción disciplinaria:", err);
    res.status(500).json({ message: "Error al desactivar el nivel de advertencia de acción disciplinaria" });
  }
};

module.exports = {
  createWarningLevel,
  getAllWarningLevels,
  getWarningLevelById,
  updateWarningLevel,
  deleteWarningLevel,
  deactivateWarningLevel
};