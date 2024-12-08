const { poolPromise, sql } = require("../database/db");

const createJobLevel = async (req, res) => {
  try {
    const { Name, Description } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddJobLevel");

    res.status(201).json({ message: "Nivel de trabajo creado exitosamente" });
  } catch (err) {
    console.error("Error al crear JobLevel:", err);
    res.status(500).json({ message: "Error al crear JobLevel" });
  }
};

const getAllJobLevels = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllJobLevels");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron niveles de trabajo" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener JobLevels:", err);
    res.status(500).json({ message: "Error al obtener JobLevels" });
  }
};

const updateJobLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Description, Status } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobLevelID", sql.Int, id)
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.Bit, Status)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateJobLevel");

    res.status(200).json({ message: "Nivel de trabajo actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar JobLevel:", err);
    res.status(500).json({ message: "Error al actualizar JobLevel" });
  }
};

const deactivateJobLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateJobLevel");

    res.status(200).json({ message: "Nivel de trabajo desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar JobLevel:", err);
    res.status(500).json({ message: "Error al desactivar JobLevel" });
  }
};

const deleteJobLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("JobLevelID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteJobLevel");

    res.status(200).json({ message: "Nivel de trabajo eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar JobLevel:", err);
    res.status(500).json({ message: "Error al eliminar JobLevel" });
  }
};

module.exports = {
  createJobLevel,
  getAllJobLevels,
  updateJobLevel,
  deactivateJobLevel,
  deleteJobLevel,
};