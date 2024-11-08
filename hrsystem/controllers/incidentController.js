const { poolPromise, sql } = require("../database/db");

const createIncident = async (req, res) => {
  try {
    const { IncidentTypeID, UserID, Reason, Date, Duration, Comments, CreatedBy } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("IncidentTypeID", sql.Int, IncidentTypeID)
      .input("UserID", sql.Int, UserID)
      .input("Reason", sql.NVarChar, Reason)
      .input("Date", sql.DateTime, Date)
      .input("Duration", sql.Int, Duration)
      .input("Comments", sql.Text, Comments)
      .input("CreatedBy", sql.Int, CreatedBy)
      .execute("AddIncident");

    res.status(201).json({ message: "Incidente creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el incidente:", err);
    res.status(500).json({ message: "Error al crear el incidente" });
  }
};

const getAllIncidents = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("GetAllIncidents");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los incidentes:", err);
    res.status(500).json({ message: "Error al obtener los incidentes" });
  }
};

const getIncidentByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("UserID", sql.Int, id)
      .execute("GetIncidentByUserId");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Incidente no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el incidente:", err);
    res.status(500).json({ message: "Error al obtener el incidente" });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { IncidentTypeID, Reason, Date, Duration, Comments, Status, UpdatedBy } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("IncidentID", sql.Int, id)
      .input("IncidentTypeID", sql.Int, IncidentTypeID)
      .input("Reason", sql.NVarChar, Reason)
      .input("Date", sql.DateTime, Date)
      .input("Duration", sql.Int, Duration)
      .input("Comments", sql.Text, Comments)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .execute("UpdateIncident");

    res.status(200).json({ message: "Incidente actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el incidente:", err);
    res.status(500).json({ message: "Error al actualizar el incidente" });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input("IncidentID", sql.Int, id)
      .execute("DeleteIncident");

    res.status(200).json({ message: "Incidente eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el incidente:", err);
    res.status(500).json({ message: "Error al eliminar el incidente" });
  }
};

const deactivateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("IncidentID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .execute("DeactivateIncident");

    res.status(200).json({ message: "Incidente desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar el incidente:", err);
    res.status(500).json({ message: "Error al desactivar el incidente" });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentByUserId,
  updateIncident,
  deleteIncident,
  deactivateIncident
};