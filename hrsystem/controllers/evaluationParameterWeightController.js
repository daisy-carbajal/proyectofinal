const { poolPromise, sql } = require("../database/db");

const createEvaluationParameterWeight = async (req, res) => {
  try {
    const { EvaluationSavedID, ParameterID, Weight, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationSavedID", sql.Int, EvaluationSavedID)
      .input("ParameterID", sql.Int, ParameterID)
      .input("Weight", sql.Float, Weight)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddEvaluationParameterWeight");

    res
      .status(201)
      .json({
        message: "Peso del parámetro de evaluación agregado exitosamente",
      });
  } catch (error) {
    if (
      error.message.includes("The total weight for this evaluation exceeds 100")
    ) {
      res
        .status(400)
        .json({
          message: "La suma total de los pesos no puede exceder 100.",
          error,
        });
    } else {
      res
        .status(500)
        .json({
          message: "Error al agregar el peso del parámetro de evaluación",
          error,
        });
    }
  }
};

const getAllEvaluationParameterWeight = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllEvaluationParameterWeight");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({
          message: "No se encontraron pesos de parámetros de evaluación",
        });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los pesos de parámetros de evaluación",
        error,
      });
  }
};

const updateEvaluationParameterWeight = async (req, res) => {
  try {
    const { EvaluationParamWeightID, Weight, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationParamWeightID", sql.Int, EvaluationParamWeightID)
      .input("Weight", sql.Float, Weight)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateEvaluationParameterWeight");

    res
      .status(200)
      .json({
        message: "Peso del parámetro de evaluación actualizado exitosamente",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el peso del parámetro de evaluación",
        error,
      });
  }
};

const deleteEvaluationParameterWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationParamWeightID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteEvaluationParameterWeight");

    res
      .status(200)
      .json({
        message: "Peso del parámetro de evaluación eliminado exitosamente",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar el peso del parámetro de evaluación",
        error,
      });
  }
};

module.exports = {
  createEvaluationParameterWeight,
  getAllEvaluationParameterWeight,
  updateEvaluationParameterWeight,
  deleteEvaluationParameterWeight,
};
