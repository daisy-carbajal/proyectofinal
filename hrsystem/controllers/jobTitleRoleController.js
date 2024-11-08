const { poolPromise, sql } = require("../database/db");

const createJobTitleRole = async (req, res) => {
  try {
    const { JobTitleID, RoleID, Status } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("RoleID", sql.Int, RoleID)
      .input("Status", sql.Bit, Status)
      .execute("AddJobTitleRole");

    res.status(201).json({ message: "Relación de título de trabajo y rol creada exitosamente" });
  } catch (err) {
    console.error("Error al crear la relación de título de trabajo y rol:", err);
    res.status(500).json({ message: "Error al crear la relación de título de trabajo y rol" });
  }
};

const getAllJobTitleRoles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("GetAllJobTitleRoles"); // Nombre del stored procedure para obtener todos

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las relaciones de título de trabajo y rol:", err);
    res.status(500).json({ message: "Error al obtener las relaciones de título de trabajo y rol" });
  }
};

const getJobTitleRoleById = async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      const result = await pool.request()
        .input("JobTitleRoleID", sql.Int, id)
        .execute("GetJobTitleRoleById");
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Relación de título de trabajo y rol no encontrada" });
      }
  
      res.status(200).json(result.recordset[0]);
    } catch (err) {
      console.error("Error al obtener la relación de título de trabajo y rol:", err);
      res.status(500).json({ message: "Error al obtener la relación de título de trabajo y rol" });
    }
  };
  
  const updateJobTitleRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { JobTitleID, RoleID, Status } = req.body;
      const pool = await poolPromise;
  
      await pool.request()
        .input("JobTitleRoleID", sql.Int, id)
        .input("JobTitleID", sql.Int, JobTitleID)
        .input("RoleID", sql.Int, RoleID)
        .input("Status", sql.Bit, Status)
        .execute("UpdateJobTitleRole"); 
  
      res.status(200).json({ message: "Relación de título de trabajo y rol actualizada exitosamente" });
    } catch (err) {
      console.error("Error al actualizar la relación de título de trabajo y rol:", err);
      res.status(500).json({ message: "Error al actualizar la relación de título de trabajo y rol" });
    }
  };
  
  const deactivateJobTitleRole = async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
  
      await pool.request()
        .input("JobTitleRoleID", sql.Int, id)
        .execute("DeactivateJobTitleRole");
  
      res.status(200).json({ message: "Relación de título de trabajo y rol desactivada exitosamente" });
    } catch (err) {
      console.error("Error al desactivar la relación de título de trabajo y rol:", err);
      res.status(500).json({ message: "Error al desactivar la relación de título de trabajo y rol" });
    }
  };
  
  module.exports = {
    createJobTitleRole,
    getAllJobTitleRoles,
    getJobTitleRoleById,
    updateJobTitleRole,
    deactivateJobTitleRole,
  };  