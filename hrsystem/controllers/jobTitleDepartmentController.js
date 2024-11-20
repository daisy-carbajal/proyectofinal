const { poolPromise, sql } = require("../database/db");

const createJobTitleDepartment = async (req, res) => {
  try {
    const { JobTitleID, DepartmentID, Status } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("Status", sql.Bit, Status)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddJobTitleDepartment"); 

    res.status(201).json({ message: "Relación de título de trabajo y departamento creada exitosamente" });
  } catch (err) {
    console.error("Error al crear la relación de título de trabajo y departamento:", err);
    res.status(500).json({ message: "Error al crear la relación de título de trabajo y departamento" });
  }
};

const getAllJobTitleDepartments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllJobTitleDepartments"); 

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las relaciones de título de trabajo y departamento:", err);
    res.status(500).json({ message: "Error al obtener las relaciones de título de trabajo y departamento" });
  }
};

const getJobTitlesByDepartmentId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
      .input("DepartmentID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetJobTitlesByDepartmentId"); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No hay puestos laborales para el ID de Departamento." });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener puestos laborales para Departamento:", err);
    res.status(500).json({ message: "Error al obtener puestos laborales para Departamento:" });
  }
};

const updateJobTitleDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { JobTitleID, DepartmentID, Status } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("JobTitleDepartmentID", sql.Int, id)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("Status", sql.Bit, Status)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateJobTitleDepartment");

    res.status(200).json({ message: "Relación de título de trabajo y departamento actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar la relación de título de trabajo y departamento:", err);
    res.status(500).json({ message: "Error al actualizar la relación de título de trabajo y departamento" });
  }
};

const deactivateJobTitleDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("JobTitleDepartmentID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateJobTitleDepartment");

    res.status(200).json({ message: "Relación de título de trabajo y departamento desactivada exitosamente" });
  } catch (err) {
    console.error("Error al desactivar la relación de título de trabajo y departamento:", err);
    res.status(500).json({ message: "Error al desactivar la relación de título de trabajo y departamento" });
  }
};

module.exports = {
  createJobTitleDepartment,
  getAllJobTitleDepartments,
  getJobTitlesByDepartmentId,
  updateJobTitleDepartment,
  deactivateJobTitleDepartment,
};