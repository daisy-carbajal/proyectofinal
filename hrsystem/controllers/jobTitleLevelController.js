const { poolPromise, sql } = require("../database/db");

const createJobTitleLevel = async (req, res) => {
  try {
    const { JobID, LevelID, Status } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobID", sql.Int, JobID)
      .input("LevelID", sql.Int, LevelID)
      .input("Status", sql.Bit, Status)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddJobTitleLevel");

    res
      .status(201)
      .json({ message: "Nivel de título de trabajo creado exitosamente" });
  } catch (err) {
    console.error("Error al crear JobTitleLevel:", err);
    res.status(500).json({ message: "Error al crear JobTitleLevel" });
  }
};

const getAllJobTitleLevels = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllJobTitleLevels");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron niveles de título de trabajo" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener JobTitleLevels:", err);
    res.status(500).json({ message: "Error al obtener JobTitleLevels" });
  }
};

const updateJobTitleLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { LevelID, Status } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobTitleLevelID", sql.Int, id)
      .input("LevelID", sql.Int, LevelID)
      .input("Status", sql.Bit, Status)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateJobTitleLevel");

    res
      .status(200)
      .json({ message: "Nivel de título de trabajo actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar JobTitleLevel:", err);
    res.status(500).json({ message: "Error al actualizar JobTitleLevel" });
  }
};

const deactivateJobTitleLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobTitleLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateJobTitleLevel");

    res
      .status(200)
      .json({ message: "Nivel de título de trabajo desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar JobTitleLevel:", err);
    res.status(500).json({ message: "Error al desactivar JobTitleLevel" });
  }
};

const deleteJobTitleLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("JobTitleLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteJobTitleLevel");

    res
      .status(200)
      .json({ message: "Nivel de título de trabajo eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar JobTitleLevel:", err);
    res.status(500).json({ message: "Error al eliminar JobTitleLevel" });
  }
};

module.exports = {
  createJobTitleLevel,
  getAllJobTitleLevels,
  updateJobTitleLevel,
  deactivateJobTitleLevel,
  deleteJobTitleLevel,
};
