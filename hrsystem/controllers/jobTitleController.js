const { poolPromise, sql } = require("../database/db");

const createJobTitle = async (req, res) => {
  try {
    const { Title, Description, DepartmentID, RoleID, LevelID } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("Title", sql.NVarChar, Title)
      .input("Description", sql.NVarChar, Description)
      .input("RequesterID", sql.Int, RequesterID)
      .output("JobTitleID", sql.Int)
      .execute("AddJobTitle");

    const jobTitleId = result.output.JobTitleID;

    await pool
      .request()
      .input("JobTitleID", sql.Int, jobTitleId)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddJobTitleDepartment");

    await pool
      .request()
      .input("JobTitleID", sql.Int, jobTitleId)
      .input("RoleID", sql.Int, RoleID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddJobTitleRole");

    await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .input("JobID", sql.Int, jobTitleId)
      .input("LevelID", sql.Int, LevelID)
      .execute("AddJobTitleLevel");

    res.status(201).json({
      message:
        "JobTitle y JobLevel creados exitosamente y asociados a Departamento y Rol",
    });
  } catch (err) {
    console.error("Error al crear JobTitle o JobLevel:", err);
    res.status(500).json({ message: "Error al crear JobTitle o JobLevel" });
  }
};

const getAllJobTitles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllJobTitles");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron JobTitles" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener JobTitles" });
  }
};

const getAllJobTitleDetails = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetJobTitleDetails");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron JobTitles" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener JobTitles" });
  }
};

const getJobTitleById = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("JobTitleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetJobTitleById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "JobTitle no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el JobTitle" });
  }
};

const updateJobTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { Title, Description } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobTitleID", sql.Int, id)
      .input("Title", sql.NVarChar, Title)
      .input("Description", sql.NVarChar, Description)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateJobTitle");

    res.status(200).json({ message: "JobTitle actualizado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar JobTitle" });
  }
};

const deleteJobTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("JobTitleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteJobTitle");

    res.status(200).json({ message: "JobTitle eliminado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar JobTitle" });
  }
};

const deactivateJobTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("JobTitleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateJobTitle");

    res.status(200).json({ message: "Puesto de Trabajo borrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al borrar Puesto de Trabajo" });
  }
};

module.exports = {
  createJobTitle,
  getAllJobTitles,
  getAllJobTitleDetails,
  getJobTitleById,
  updateJobTitle,
  deleteJobTitle,
  deactivateJobTitle,
};
