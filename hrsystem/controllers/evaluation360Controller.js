const { poolPromise, sql } = require("../database/db");
const schedule = require("node-schedule");
const { sendNotificationEmail } = require("../services/sendNotificationEmail");

const createEvaluation360 = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const {
      EvaluateeUserID,
      Comments,
      DateCreated,
      DateToReview,
      EvaluationSavedID,
      Evaluators = [],
    } = req.body;
    const RequesterID = req.userId;

    if (!Evaluators.length) {
      throw new Error("Debe proporcionar al menos un evaluador.");
    }

    await transaction.begin();
    console.log("Transacción iniciada");

    // 1. Insertar en Evaluation360
    const evaluation360Result = await transaction
      .request()
      .input("EvaluateeUserID", sql.Int, EvaluateeUserID)
      .input("Comments", sql.NVarChar, Comments || "")
      .input("DateCreated", sql.DateTime, DateCreated)
      .input("DateToReview", sql.DateTime, DateToReview)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddEvaluation360");

    const Evaluation360ID = evaluation360Result.recordset[0].Evaluation360ID;

    console.log(`Evaluation360 creada con ID: ${Evaluation360ID}`);

    for (const evaluator of Evaluators) {
      // 2.1 Insertar en EvaluationMaster
      const evaluationMasterResult = await transaction
        .request()
        .input("EvaluatorUserID", sql.Int, evaluator.EvaluatorUserID)
        .input("EvaluateeUserID", sql.Int, EvaluateeUserID)
        .input("EvaluationSavedID", sql.Int, EvaluationSavedID)
        .input("Evaluation360ID", sql.Int, Evaluation360ID)
        .input("DateCreated", sql.DateTime, DateCreated)
        .input("DateToReview", sql.DateTime, DateToReview)
        .input("Comments", sql.Text, Comments || "")
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddEvaluationMaster");
    
      const EvaluationMasterID =
        evaluationMasterResult.recordset[0].EvaluationMasterID;
    
      console.log(
        `EvaluationMaster creada con ID: ${EvaluationMasterID} para evaluador ${evaluator.EvaluatorUserID}`
      );
    
      // 2.2 Obtener los parámetros asociados desde EvaluationParameterWeight
      const parameterWeightsResult = await transaction
        .request()
        .input("EvaluationSavedID", sql.Int, EvaluationSavedID)
        .execute("GetParametersByEvaluationSavedID");
    
      const parameters = parameterWeightsResult.recordset;
    
      console.log(`Parámetros encontrados para EvaluationSavedID ${EvaluationSavedID}:`, parameters);
    
      // 2.3 Insertar los parámetros en EvaluationDetail
      for (const parameter of parameters) {
        await transaction
          .request()
          .input("EvaluationMasterID", sql.Int, EvaluationMasterID)
          .input("ParameterID", sql.Int, parameter.ParameterID)
          .input("CalificationID", sql.Int, null) // Calificación aún no asignada
          .input("RequesterID", sql.Int, RequesterID)
          .execute("AddEvaluationDetail");
      }
    
      console.log(
        `Parámetros asociados a EvaluationSavedID ${EvaluationSavedID} agregados a EvaluationDetail para EvaluationMasterID ${EvaluationMasterID}`
      );

      const nameResult = await transaction
        .request()
        .input("UserID", sql.Int, evaluator.EvaluatorUserID)
        .execute("GetUserName");

      const evaluatorName = nameResult.recordset[0]?.FullName;

      if (!evaluatorName) {
        throw new Error(
          `No se pudo obtener el nombre del evaluador ${evaluator.EvaluatorUserID}`
        );
      }

      const preferencesResult = await transaction
        .request()
        .input("UserID", sql.Int, evaluator.EvaluatorUserID)
        .execute("VerifyUserPreferences");

      const {
        Email: evaluatorEmail,
        EnableEmailNotifications,
        EnablePushNotifications,
      } = preferencesResult.recordset[0];

      const subjectMessage = "Nueva Evaluación 360 Asignada";
      const titleMessage = "Nueva Evaluación 360 Creada";
      const emailNotificationMessage = `
        ${evaluatorName}, se le ha asignado una nueva evaluación 360 para que complete.<br>
        <a href="http://localhost:4200/home/evaluation360/details/${EvaluationMasterID}" target="_blank">
          Revisar evaluación
        </a>
      `;
      const pushNotificationMessage = `
        ${evaluatorName}, se ha creado una nueva evaluación para usted. Puede revisarla en el sistema.
      `;

      await transaction
        .request()
        .input("RequesterID", sql.Int, RequesterID)
        .input("UserID", sql.Int, evaluator.EvaluatorUserID)
        .input("Title", sql.NVarChar, titleMessage)
        .input("Message", sql.NVarChar, emailNotificationMessage)
        .execute("AddNotification");

      if (EnableEmailNotifications) {
        await sendNotificationEmail(
          evaluatorEmail,
          subjectMessage,
          titleMessage,
          emailNotificationMessage
        );
      } else {
        console.log(
          `El evaluador ${evaluator.EvaluatorUserID} tiene deshabilitadas las notificaciones por correo.`
        );
      }

      const io = req.app.get("socketio");
      if (EnablePushNotifications && io) {
        io.to(`user_${evaluator.EvaluatorUserID}`).emit("new_notification", {
          title: titleMessage,
          message: pushNotificationMessage,
        });
      } else {
        console.log(
          `El evaluador ${evaluator.EvaluatorUserID} tiene deshabilitadas las notificaciones push o Socket.IO no está configurado.`
        );
      }
    }

    await transaction.commit();
    console.log("Transacción confirmada");

    res.status(201).json({
      message: "Evaluación 360 y notificaciones creadas exitosamente.",
      evaluation360ID: Evaluation360ID,
    });
  } catch (error) {
    console.error("Error al crear la evaluación 360:", error);

    if (transaction._aborted === false) {
      await transaction.rollback();
      console.log("Transacción revertida");
    }

    res.status(500).json({
      message: "Error al crear la evaluación 360 y los registros asociados.",
      error: error.message,
    });
  }
};

const getAllEvaluation360 = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllEvaluation360");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener evaluaciones 360:", error);
    res.status(500).json({
      message: "Error al obtener las evaluaciones 360",
      error: error.message,
    });
  }
};

const getEvaluation360Details = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluation360Details");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener evaluaciones 360:", error);
    res.status(500).json({
      message: "Error al obtener las evaluaciones 360",
      error: error.message,
    });
  }
};

const updateEvaluation360 = async (req, res) => {
  try {
    const { id } = req.params;
    const { Comments, DateToReview } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Evaluation360ID", sql.Int, id)
      .input("Comments", sql.NVarChar, Comments)
      .input("DateToReview", sql.DateTime, DateToReview)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateEvaluation360");

    res
      .status(200)
      .json({ message: "Evaluación 360 actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar evaluación 360:", error);
    res.status(500).json({
      message: "Error al actualizar la evaluación 360",
      error: error.message,
    });
  }
};

const deactivateEvaluation360 = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Evaluation360ID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateEvaluation360");

    res
      .status(200)
      .json({ message: "Evaluación 360 desactivada exitosamente" });
  } catch (error) {
    console.error("Error al desactivar evaluación 360:", error);
    res.status(500).json({
      message: "Error al desactivar la evaluación 360",
      error: error.message,
    });
  }
};

const deleteEvaluation360 = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Evaluation360ID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteEvaluation360");

    res
      .status(200)
      .json({ message: "Evaluación 360 eliminada permanentemente" });
  } catch (error) {
    console.error("Error al eliminar evaluación 360:", error);
    res.status(500).json({
      message: "Error al eliminar la evaluación 360",
      error: error.message,
    });
  }
};

const updateExpiredEvaluations360 = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().execute("UpdateExpiredEvaluations");

    res.status(200).json({
      message: "Evaluaciones expiradas actualizadas correctamente",
      rowsAffected: result.rowsAffected,
    });
  } catch (error) {
    console.error("Error al actualizar evaluaciones expiradas:", error);
    res.status(500).json({
      message: "Error al actualizar las evaluaciones expiradas",
      error: error.message,
    });
  }
};

schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().execute("UpdateExpiredEvaluations");

    console.log(
      `Evaluaciones expiradas actualizadas: ${result.rowsAffected} registros.`
    );
  } catch (error) {
    console.error(
      "Error al actualizar evaluaciones expiradas automáticamente:",
      error
    );
  }
});

module.exports = {
  createEvaluation360,
  getAllEvaluation360,
  getEvaluation360Details,
  updateEvaluation360,
  deactivateEvaluation360,
  deleteEvaluation360,
  updateExpiredEvaluations360,
};
