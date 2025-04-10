const { poolPromise, sql } = require("../database/db");

const createEvaluationSaved = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);
  try {
    const { Name, TypeID, DepartmentID, ParameterWeights } = req.body;
    const RequesterID = req.userId;

    const totalWeight = ParameterWeights.reduce(
      (sum, weight) => sum + weight.Weight,
      0
    );
    if (totalWeight !== 100) {
      return res.status(400).json({
        message: `La suma total de los pesos debe ser exactamente 100. Suma actual: ${totalWeight}`,
      });
    }

    await transaction.begin();

    const result = await transaction
      .request()
      .input("Name", sql.VarChar(255), Name)
      .input("TypeID", sql.Int, TypeID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddEvaluationSaved");

    const EvaluationSavedID = result.recordset[0].EvaluationSavedID;

    for (const weight of ParameterWeights) {
      await transaction
        .request()
        .input("EvaluationSavedID", sql.Int, EvaluationSavedID)
        .input("ParameterID", sql.Int, weight.ParameterID)
        .input("Weight", sql.Float, weight.Weight)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddEvaluationParameterWeight");
    }

    await transaction.commit();

    res.status(201).json({
      message: "Evaluación y parámetros de peso guardados exitosamente",
    });
  } catch (error) {
    await transaction.rollback();

    if (
      error.message.includes("La suma total de los pesos no puede exceder 100.")
    ) {
      res.status(400).json({
        message: "La suma total de los pesos no puede exceder 100.",
        error,
      });
    } else {
      res.status(500).json({
        message: "Error al guardar la evaluación y los parámetros de peso",
        error,
      });
    }
  }
};


const getAllEvaluationSaved = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllEvaluationSaved");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones guardadas" });
    }

    const processedRecordset = result.recordset.map((evaluation) => {
      if (evaluation.Parameters) {
        try {
          evaluation.Parameters = JSON.parse(evaluation.Parameters);
        } catch (parseError) {
          console.error("Error al parsear el campo Parameters:", parseError);
        }
      }
      return evaluation;
    });

    res.status(200).json(processedRecordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener evaluaciones guardadas", error });
  }
};

const getEvaluationSavedFiltered = async (req, res) => {
  try {
    const { DepartmentID, TypeID } = req.query;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("DepartmentID", sql.Int, DepartmentID || null)
      .input("TypeID", sql.Int, TypeID || null)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluationSavedFiltered");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "No se encontraron evaluaciones con los filtros aplicados",
      });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al filtrar las evaluaciones guardadas", error });
  }
};

const getEvaluationSavedByID = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("EvaluationSavedID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluationSavedById");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones con ese ID." });
    }

    const processedRecord = result.recordset.map((evaluation) => {
      if (evaluation.Parameters) {
        try {
          evaluation.Parameters = JSON.parse(evaluation.Parameters);
        } catch (parseError) {
          console.error("Error al parsear el campo Parameters:", parseError);
        }
      }
      return evaluation;
    });

    res.status(200).json(processedRecord[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al filtrar las evaluaciones guardadas", error });
  }
};

const updateEvaluationSaved = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const { Name, TypeID, DepartmentID, ParameterWeights = [], ParametersToDelete = [] } = req.body;
    const { id } = req.params;
    const RequesterID = req.userId;

    const totalWeight = ParameterWeights.reduce((sum, param) => sum + param.Weight, 0);

    if (totalWeight !== 100) {
      return res.status(400).json({
        message: `La suma total de los pesos debe ser exactamente 100. Suma actual: ${totalWeight}`,
      });
    }

    await transaction.begin();

    await transaction
      .request()
      .input("EvaluationSavedID", sql.Int, id)
      .input("Name", sql.NVarChar, Name)
      .input("TypeID", sql.Int, TypeID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateEvaluationSaved");

    for (const weight of ParameterWeights) {
      await transaction
        .request()
        .input("EvaluationSavedID", sql.Int, id)
        .input("ParameterID", sql.Int, weight.ParameterID)
        .input("Weight", sql.Float, weight.Weight)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("ManageEvaluationParameterWeight");
    }

    for (const paramId of ParametersToDelete) {
      await transaction
        .request()
        .input("EvaluationSavedID", sql.Int, id)
        .input("ParameterID", sql.Int, paramId)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("DeleteEvaluationParameterWeight");
    }

    await transaction.commit();

    res.status(200).json({
      message: "Evaluación y parámetros actualizados exitosamente.",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      message: "Error al actualizar la evaluación y parámetros.",
      error: error.message || error,
    });
  }
};

const deactivateEvaluationSaved = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationSavedID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateEvaluationSaved");

    res.status(200).json({ message: "Evaluación desactivada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar la evaluación", error });
  }
};

const deleteEvaluationSaved = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationSavedID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteEvaluationSaved");

    res.status(200).json({ message: "Evaluación eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la evaluación", error });
  }
};

module.exports = {
  createEvaluationSaved,
  getAllEvaluationSaved,
  getEvaluationSavedFiltered,
  getEvaluationSavedByID,
  updateEvaluationSaved,
  deactivateEvaluationSaved,
  deleteEvaluationSaved,
};
