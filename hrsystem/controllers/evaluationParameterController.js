const { poolPromise, sql } = require("../database/db");

const createEvaluationParameter = async (req, res) => {
  try {
    const { Name, Description, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.VarChar(50), Description)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddEvaluationParameter");

    res
      .status(201)
      .json({ message: "Parámetro de evaluación agregado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar parámetro de evaluación", error });
  }
};

const getAllEvaluationParameters = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllEvaluationParameters");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron parámetros de evaluación" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los parámetros de evaluación",
        error,
      });
  }
};

const updateEvaluationParameter = async (req, res) => {
  try {
    const { EvaluationParameterID, Name, Description, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationParameterID", sql.Int, EvaluationParameterID)
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.VarChar(50), Description)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateEvaluationParameter");

    res
      .status(200)
      .json({ message: "Parámetro de evaluación actualizado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el parámetro de evaluación",
        error,
      });
  }
};

const deactivateEvaluationParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationParameterID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateEvaluationParameter");

    res
      .status(200)
      .json({ message: "Parámetro de evaluación desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al desactivar el parámetro de evaluación",
        error,
      });
  }
};
const deleteEvaluationParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationParameterID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteEvaluationParameter");

    res
      .status(200)
      .json({ message: "Parámetro de evaluación eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el parámetro de evaluación", error });
  }
};

module.exports = {
  createEvaluationParameter,
  getAllEvaluationParameters,
  updateEvaluationParameter,
  deactivateEvaluationParameter,
  deleteEvaluationParameter,
};
