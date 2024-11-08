const { poolPromise, sql } = require("../database/db");

const createIncidentType = async (req, res) => {
  try {
    const { Description } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool.request()
      .input("Description", sql.NVarChar, Description)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddIncidentType");

    res.status(201).json({ message: "Tipo de incidente creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el tipo de incidente:", err);
    res.status(500).json({ message: "Error al crear el tipo de incidente" });
  }
};

const getAllIncidentTypes = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllIncidentTypes"); 

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los tipos de incidente:", err);
    res.status(500).json({ message: "Error al obtener los tipos de incidente" });
  }
};

const getIncidentTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
      .input("IncidentTypeID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetIncidentTypeById"); 
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Tipo de incidente no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el tipo de incidente:", err);
    res.status(500).json({ message: "Error al obtener el tipo de incidente" });
  }
};

const updateIncidentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { Description, Status } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    await pool.request()
      .input("IncidentTypeID", sql.Int, id)
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.Bit, Status)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateIncidentType");

    res.status(200).json({ message: "Tipo de incidente actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el tipo de incidente:", err);
    res.status(500).json({ message: "Error al actualizar el tipo de incidente" });
  }
};

const deleteIncidentType = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool.request()
      .input("IncidentTypeID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteIncidentType");

    res.status(200).json({ message: "Tipo de incidente eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el tipo de incidente:", err);
    res.status(500).json({ message: "Error al eliminar el tipo de incidente" });
  }
};

module.exports = {
  createIncidentType,
  getAllIncidentTypes,
  getIncidentTypeById,
  updateIncidentType,
  deleteIncidentType
};