const { poolPromise, sql } = require("../database/db");

const createJobTitleChange = async (req, res) => {
  try {
    const { UserID, JobTitleID, StartDate, CreatedBy } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("StartDate", sql.Date, StartDate)
      .input("CreatedBy", sql.Int, CreatedBy)
      .execute("AddJobTitleChange");

    res.status(201).json({ message: "Cambio de título de trabajo creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el cambio de título de trabajo:", err);
    res.status(500).json({ message: "Error al crear el cambio de título de trabajo" });
  }
};

const getAllJobTitleChanges = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("GetAllJobTitleChanges");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los cambios de título de trabajo:", err);
    res.status(500).json({ message: "Error al obtener los cambios de título de trabajo" });
  }
};

const getJobTitleChangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("JobTitleChangeID", sql.Int, id)
      .execute("GetJobTitleChangesByUserID");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Cambio de título de trabajo no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el cambio de título de trabajo:", err);
    res.status(500).json({ message: "Error al obtener el cambio de título de trabajo" });
  }
};

const updateJobTitleChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { JobTitleID, StartDate, EndDate, Status, UpdatedBy } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("JobTitleChangeID", sql.Int, id)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("Status", sql.Bit, Status)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .execute("UpdateJobTitleChange");

    res.status(200).json({ message: "Cambio de título de trabajo actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el cambio de título de trabajo:", err);
    res.status(500).json({ message: "Error al actualizar el cambio de título de trabajo" });
  }
};

const deactivateJobTitleChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("JobTitleChangeID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .execute("DeactivateJobTitleChange");

    res.status(200).json({ message: "Cambio de título de trabajo desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar el cambio de título de trabajo:", err);
    res.status(500).json({ message: "Error al desactivar el cambio de título de trabajo" });
  }
};

module.exports = {
  createJobTitleChange,
  getAllJobTitleChanges,
  getJobTitleChangeById,
  updateJobTitleChange,
  deactivateJobTitleChange,
};