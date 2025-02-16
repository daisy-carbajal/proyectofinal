const { poolPromise, sql } = require("../database/db");
const schedule = require("node-schedule");
const { sendNotificationEmail } = require("../services/sendNotificationEmail");

const createEvaluationMaster = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const {
      EvaluatorUserID,
      EvaluateeUserID,
      EvaluationSavedID,
      Evaluation360ID,
      DateCreated,
      DateToReview,
      Comments,
      Details,
    } = req.body;

    const RequesterID = req.userId;

    await transaction.begin();
    console.log("Transacción iniciada");

    const result = await transaction
      .request()
      .input("EvaluatorUserID", sql.Int, EvaluatorUserID)
      .input("EvaluateeUserID", sql.Int, EvaluateeUserID)
      .input("EvaluationSavedID", sql.Int, EvaluationSavedID)
      .input("Evaluation360ID", sql.Int, Evaluation360ID || null)
      .input("DateCreated", sql.DateTime, DateCreated)
      .input("DateToReview", sql.DateTime, DateToReview)
      .input("Comments", sql.NVarChar, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddEvaluationMaster");

    const EvaluationMasterID = result.recordset[0].EvaluationMasterID;

    for (const detail of Details) {
      await transaction
        .request()
        .input("EvaluationMasterID", sql.Int, EvaluationMasterID)
        .input("ParameterID", sql.Int, detail.ParameterID)
        .input("CalificationID", sql.Int, detail.CalificationID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddEvaluationDetail");
    }

    const nameResult = await transaction
      .request()
      .input("UserID", sql.Int, EvaluateeUserID)
      .execute("GetUserName");

    const evaluateeName = nameResult.recordset[0]?.FullName;

    if (!evaluateeName) {
      throw new Error("No se pudo obtener el nombre del EvaluateeUserID");
    }

    const preferencesResult = await transaction
      .request()
      .input("UserID", sql.Int, EvaluateeUserID)
      .execute("VerifyUserPreferences");

    const {
      Email: evaluateeEmail,
      EnableEmailNotifications,
      EnablePushNotifications,
    } = preferencesResult.recordset[0];

    if (!evaluateeEmail) {
      throw new Error("No se pudo obtener el correo del RequesterID");
    }

    const subjectMessage = "Nueva Evaluación Creada";
    const titleMessage = "Nueva Evaluación Creada";
    const emailNotificationMessage = `
  ${evaluateeName}, se ha creado una nueva evaluación para usted. Puede revisarla en el sistema.<br>
  <a href="http://localhost:4200/home/evaluation/details/${EvaluationMasterID}" target="_blank">
    Revisar evaluación
  </a>
`;
    const pushNotificationMessage = `
  ${evaluateeName}, se ha creado una nueva evaluación para usted. Puede revisarla en el sistema.`;

    await transaction
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .input("UserID", sql.Int, EvaluateeUserID)
      .input("Title", sql.NVarChar, titleMessage)
      .input("Message", sql.NVarChar, emailNotificationMessage)
      .execute("AddNotification");

    if (EnableEmailNotifications) {
      await sendNotificationEmail(
        evaluateeEmail,
        subjectMessage,
        titleMessage,
        emailNotificationMessage
      );
    } else {
      console.log(
        `El usuario ${EvaluateeUserID} tiene deshabilitadas las notificaciones por correo.`
      );
    }

    const io = req.app.get("socketio");
    if (EnablePushNotifications && io) {
      io.to(`user_${EvaluateeUserID}`).emit("new_notification", {
        title: "Nueva Evaluación",
        message: pushNotificationMessage,
      });
    } else {
      console.log(
        `El usuario ${EvaluateeUserID} tiene deshabilitadas las notificaciones push o Socket.IO no está configurado.`
      );
    }

    await transaction.commit();
    console.log("Transacción confirmada");

    res.status(201).json({
      message: "Evaluación, detalles y notificación creados exitosamente",
      evaluationMasterID: EvaluationMasterID,
    });
  } catch (error) {
    console.error("Error al crear la evaluación:", error);

    if (transaction._aborted === false) {
      await transaction.rollback();
      console.log("Transacción revertida");
    }

    res.status(500).json({
      message: "Error al crear la evaluación y los detalles",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Error al obtener las evaluaciones con detalle",
      error,
    });
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
      return res.status(404).json({
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
      return res.status(404).json({
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
          if (typeof evaluation.ParametersAndCalifications === "string") {
            evaluation.ParametersAndCalifications = JSON.parse(
              evaluation.ParametersAndCalifications
            );
          }
        } catch (parseError) {
          console.error(
            "Error al parsear ParametersAndCalifications:",
            parseError
          );
        }
      }
      return evaluation;
    });

    res.status(200).json(processedRecord[0]); // Enviar solo el primer registro
  } catch (error) {
    console.error("Error en la consulta:", error);
    res
      .status(500)
      .json({ message: "Error al filtrar las evaluaciones guardadas", error });
  }
};

const getEvaluationMasterDetailsBy360ID = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Evaluation360ID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetEvaluationMasterDetailsBy360ID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron evaluaciones con ese ID." });
    }

    const processedRecord = result.recordset.map((evaluation) => {
      if (evaluation.ParametersAndCalifications) {
        try {
          if (typeof evaluation.ParametersAndCalifications === "string") {
            evaluation.ParametersAndCalifications = JSON.parse(
              evaluation.ParametersAndCalifications
            );
          }
        } catch (parseError) {
          console.error(
            "Error al parsear ParametersAndCalifications:",
            parseError
          );
        }
      }
      return evaluation;
    });

    res.status(200).json(processedRecord); // Enviar solo el primer registro
  } catch (error) {
    console.error("Error en la consulta:", error);
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

const updateEvaluationMaster = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const { id } = req.params;
    const {
      EvaluationMasterID,
      EvaluatorUserID,
      EvaluateeUserID,
      DateCreated,
      DateToReview,
      Comments,
      Details,
    } = req.body;
    const RequesterID = req.userId;

    await transaction.begin();

    await transaction
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("EvaluatorUserID", sql.Int, EvaluatorUserID)
      .input("DateCreated", sql.DateTime, DateCreated)
      .input("DateToReview", sql.DateTime, DateToReview)
      .input("Comments", sql.Text, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateEvaluationMaster");

    for (const detail of Details) {
      await transaction
        .request()
        .input("EvaluationMasterID", sql.Int, id)
        .input("ParameterID", sql.Int, detail.ParameterID)
        .input("CalificationID", sql.Int, detail.CalificationID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("UpdateEvaluationDetail");
    }

    const evaluationName = await transaction
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .execute("GetEvaluationNameByMasterID");

    const EvaluationName = evaluationName.recordset[0].EvaluationName;

    const nameResult = await transaction
      .request()
      .input("UserID", sql.Int, EvaluateeUserID)
      .execute("GetUserName");

    const evaluateeName = nameResult.recordset[0]?.FullName;

    if (!evaluateeName) {
      throw new Error("No se pudo obtener el nombre del EvaluateeUserID");
    }

    const preferencesResult = await transaction
      .request()
      .input("UserID", sql.Int, EvaluateeUserID)
      .execute("VerifyUserPreferences");

    const {
      Email: evaluateeEmail,
      EnableEmailNotifications,
      EnablePushNotifications,
    } = preferencesResult.recordset[0];

    if (!evaluateeEmail) {
      throw new Error("No se pudo obtener el correo del RequesterID");
    }

    const subjectMessage = "Se actualizada Evaluación";
    const titleMessage = "Evaluación Actualizada";
    const emailNotificationMessage = `
  ${evaluateeName}, se ha actualizada la evaluación de ${EvaluationName}. Puede revisarla en el sistema.<br>
  <a href="http://localhost:4200/home/evaluation/details/${EvaluationMasterID}" target="_blank">
    Revisar evaluación
  </a>
`;
    const pushNotificationMessage = `
  ${evaluateeName}, se ha actualizado la evaluación de ${EvaluationName}.`;

    await transaction
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .input("UserID", sql.Int, EvaluateeUserID)
      .input("Title", sql.NVarChar, "Nueva Evaluación")
      .input("Message", sql.NVarChar, emailNotificationMessage)
      .execute("AddNotification");

    if (EnableEmailNotifications) {
      await sendNotificationEmail(
        evaluateeEmail,
        subjectMessage,
        titleMessage,
        emailNotificationMessage
      );
    } else {
      console.log(
        `El usuario ${EvaluateeUserID} tiene deshabilitadas las notificaciones por correo.`
      );
    }

    const io = req.app.get("socketio");
    if (EnablePushNotifications && io) {
      io.to(`user_${EvaluateeUserID}`).emit("new_notification", {
        title: "Evaluación Actualizada",
        message: pushNotificationMessage,
      });
    } else {
      console.log(
        `El usuario ${EvaluateeUserID} tiene deshabilitadas las notificaciones push o Socket.IO no está configurado.`
      );
    }

    await transaction.commit();

    res.status(200).json({ message: "Evaluación actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar evaluación:", error);

    if (transaction._aborted === false) {
      await transaction.rollback();
      console.log("Transacción revertida");
    }

    res.status(500).json({ message: "Error al actualizar evaluación", error });
  }
};

const acknowledgeEvaluationMaster = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const { id } = req.params;
    const { EvaluatorUserID, Comments } = req.body;
    const RequesterID = req.userId;

    await transaction.begin();

    await transaction
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("Comments", sql.Text, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AcknowledgeEvaluationMaster");

    const evaluationName = await transaction
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .execute("GetEvaluationNameByMasterID");

    const EvaluationName = evaluationName.recordset[0].EvaluationName;

    const nameResult = await transaction
      .request()
      .input("UserID", sql.Int, EvaluatorUserID)
      .execute("GetUserName");

    const name = nameResult.recordset[0]?.FullName;

    if (!name) {
      throw new Error("No se pudo obtener el nombre del Evaluador");
    }

    const preferencesResult = await transaction
      .request()
      .input("UserID", sql.Int, EvaluatorUserID)
      .execute("VerifyUserPreferences");

    const {
      Email: evaluateeEmail,
      EnableEmailNotifications,
      EnablePushNotifications,
    } = preferencesResult.recordset[0];

    if (!evaluateeEmail) {
      throw new Error("No se pudo obtener el correo del RequesterID");
    }

    const subjectMessage = "Se aceptado el resultado de la Evaluación";
    const titleMessage = "Evaluación Aceptada";
    const emailNotificationMessage = `
  ${name}, se ha aceptado la evaluación de ${EvaluationName}. Puede revisarla en el sistema.<br>
  <a href="http://localhost:4200/home/evaluation/details/${id}" target="_blank">
    Revisar evaluación
  </a>
`;
    const pushNotificationMessage = `
  ${name}, se ha aceptado la evaluación de ${EvaluationName}.`;

    await transaction
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .input("UserID", sql.Int, EvaluatorUserID)
      .input("Title", sql.NVarChar, "Nueva Evaluación")
      .input("Message", sql.NVarChar, emailNotificationMessage)
      .execute("AddNotification");

    if (EnableEmailNotifications) {
      await sendNotificationEmail(
        evaluateeEmail,
        subjectMessage,
        titleMessage,
        emailNotificationMessage
      );
    } else {
      console.log(
        `El usuario ${EvaluatorUserID} tiene deshabilitadas las notificaciones por correo.`
      );
    }

    const io = req.app.get("socketio");
    if (EnablePushNotifications && io) {
      io.to(`user_${EvaluatorUserID}`).emit("new_notification", {
        title: "Evaluación Aceptada",
        message: pushNotificationMessage,
      });
    } else {
      console.log(
        `El usuario ${EvaluatorUserID} tiene deshabilitadas las notificaciones push o Socket.IO no está configurado.`
      );
    }

    await transaction.commit();

    res.status(200).json({ message: "Evaluación aceptada exitosamente" });
  } catch (error) {
    console.error("Error al aceptar evaluación:", error);

    if (transaction._aborted === false) {
      await transaction.rollback();
      console.log("Transacción revertida");
    }

    res.status(500).json({ message: "Error al aceptar evaluación", error });
  }
};

const updateExpiredEvaluations = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().execute("UpdateExpiredEvaluations");

    res.status(200).json({
      message: "Actualización completada exitosamente.",
      rowsAffected: result.rowsAffected,
    });
  } catch (error) {
    console.error("Error al ejecutar la actualización de evaluaciones:", error);
    res.status(500).json({
      message: "Error al actualizar las evaluaciones.",
      error: error.message || error,
    });
  }
};

schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().execute("UpdateExpiredEvaluations");

    console.log(
      `Actualización automática completada: ${result.rowsAffected} registros afectados.`
    );
  } catch (error) {
    console.error(
      "Error durante la actualización automática de evaluaciones:",
      error
    );
  }
});

module.exports = {
  createEvaluationMaster,
  getAllEvaluationMaster,
  getAllEvaluationMasterDetails,
  getEvaluationMasterByEvaluationID,
  getEvaluationMasterDetailsByID,
  getEvaluationMasterDetailsBy360ID,
  getEvaluationMasterByUserID,
  deactivateEvaluationMaster,
  deleteEvaluationMaster,
  updateEvaluationMaster,
  acknowledgeEvaluationMaster,
  updateExpiredEvaluations
};
