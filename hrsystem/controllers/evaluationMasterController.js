const { poolPromise, sql } = require("../database/db");

const createEvaluationMaster = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);
  try {
    const {
      EvaluatorUserID,
      EvaluateeUserID,
      EvaluationSavedID,
      DateCreated,
      Comments,
      Details,
    } = req.body;
    const RequesterID = req.userId;

    // Iniciar una transacción
    await transaction.begin();

    // Insertar el registro en EvaluationMaster
    const result = await transaction
      .request()
      .input("EvaluatorUserID", sql.Int, EvaluatorUserID)
      .input("EvaluateeUserID", sql.Int, EvaluateeUserID)
      .input("EvaluationSavedID", sql.Int, EvaluationSavedID)
      .input("DateCreated", sql.DateTime, DateCreated)
      .input("Comments", sql.NVarChar, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddEvaluationMaster");

    // Obtener el ID de la evaluación recién creada
    const EvaluationMasterID = result.recordset[0].EvaluationMasterID;

    // Insertar múltiples registros en EvaluationDetail
    for (const detail of Details) {
      await transaction
        .request()
        .input("EvaluationMasterID", sql.Int, EvaluationMasterID)
        .input("ParameterID", sql.Int, detail.ParameterID)
        .input("CalificationID", sql.Int, detail.CalificationID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddEvaluationDetail");
    }

    // Confirmar la transacción
    await transaction.commit();

    res
      .status(201)
      .json({ message: "Evaluación y detalles creados exitosamente" });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error("Error al crear la evaluación y los detalles:", error);
    res
      .status(500)
      .json({ message: "Error al crear la evaluación y los detalles" });
  }
};

const getAllEvaluationMaster = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllEvaluationMaster");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las evaluaciones", error });
  }
};

const getAllEvaluationMasterDetails = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllEvaluationMasterDetails");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones con detalle" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las evaluaciones con detalle", error });
  }
};

const getEvaluationMasterByEvaluationID = async (req, res) => {
  try {
    const { EvaluationMasterID } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("EvaluationMasterID", sql.Int, EvaluationMasterID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluationMasterByEvaluationID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({
          message: "No se encontró la evaluación con el ID proporcionado",
        });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la evaluación por ID", error });
  }
};

const getEvaluationMasterByUserID = async (req, res) => {
  try {
    const { UserID } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluationMasterByUserID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron evaluaciones para el usuario con el ID proporcionado",
        });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las evaluaciones por UserID", error });
  }
};

const getEvaluationMasterDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluationMasterDetailsByID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones con ese ID." });
    }

    // Los parámetros y calificaciones ya están en formato JSON, no se necesita hacer el parseo manual
    const processedRecord = result.recordset.map((evaluation) => {
      // Enviar directamente los parámetros y calificaciones en JSON
      if (evaluation.ParametersAndCalifications) {
        try {
          // Verificar si ParametersAndCalifications es una cadena JSON (en caso de no serlo)
          if (typeof evaluation.ParametersAndCalifications === 'string') {
            evaluation.ParametersAndCalifications = JSON.parse(evaluation.ParametersAndCalifications);
          }
        } catch (parseError) {
          console.error("Error al parsear ParametersAndCalifications:", parseError);
        }
      }
      return evaluation;
    });

    res.status(200).json(processedRecord[0]); // Enviar solo el primer registro
  } catch (error) {
    console.error('Error en la consulta:', error);
    res
      .status(500)
      .json({ message: "Error al filtrar las evaluaciones guardadas", error });
  }
};

const deactivateEvaluationMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateEvaluationMaster");

    res.status(200).json({ message: "Evaluación desactivada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar la evaluación", error });
  }
};

const deleteEvaluationMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteEvaluationMaster");

    res.status(200).json({ message: "Evaluación eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la evaluación", error });
  }
};

module.exports = {
  createEvaluationMaster,
  getAllEvaluationMaster,
  getAllEvaluationMasterDetails,
  getEvaluationMasterByEvaluationID,
  getEvaluationMasterDetailsByID,
  getEvaluationMasterByUserID,
  deactivateEvaluationMaster,
  deleteEvaluationMaster,
};
