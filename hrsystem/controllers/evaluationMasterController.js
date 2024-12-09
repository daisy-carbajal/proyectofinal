const { poolPromise, sql } = require("../database/db");
const { sendNotificationEmail } = require("../services/sendNotificationEmail"); // Importa tu archivo de envío de correos

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

    // Iniciar la transacción
    await transaction.begin();
    console.log("Transacción iniciada");

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

    const EvaluationMasterID = result.recordset[0].EvaluationMasterID;

    // Insertar detalles
    for (const detail of Details) {
      await transaction
        .request()
        .input("EvaluationMasterID", sql.Int, EvaluationMasterID)
        .input("ParameterID", sql.Int, detail.ParameterID)
        .input("CalificationID", sql.Int, detail.CalificationID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddEvaluationDetail");
    }

    // Obtener el correo y las preferencias del RequesterID
    const preferencesResult = await transaction
      .request()
      .input("UserID", sql.Int, RequesterID)
      .execute("VerifyUserPreferences"); // Nuevo SP para obtener preferencias

    const { Email: requesterEmail, EnableEmailNotifications, EnablePushNotifications } =
      preferencesResult.recordset[0];

    if (!requesterEmail) {
      throw new Error("No se pudo obtener el correo del RequesterID");
    }

    // Crear mensaje para la notificación
    const notificationMessage = `Se ha creado una nueva evaluación para el usuario con ID ${EvaluateeUserID}. Puede revisarla en el sistema.`;

    // Crear y guardar notificación
    await transaction
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .input("UserID", sql.Int, EvaluateeUserID)
      .input("Title", sql.NVarChar, "Nueva Evaluación")
      .input("Message", sql.NVarChar, notificationMessage)
      .execute("AddNotification");

    // Enviar correo solo si EnableEmailNotifications es TRUE
    if (EnableEmailNotifications) {
      await sendNotificationEmail(requesterEmail, notificationMessage);
    } else {
      console.log(`El usuario ${RequesterID} tiene deshabilitadas las notificaciones por correo.`);
    }

    // Enviar notificación push solo si EnablePushNotifications es TRUE
    const io = req.app.get("socketio");
    if (EnablePushNotifications && io) {
      io.to(`user_${RequesterID}`).emit("new_notification", {
        title: "Nueva Evaluación",
        message: notificationMessage,
      });
    } else {
      console.log(`El usuario ${RequesterID} tiene deshabilitadas las notificaciones push o Socket.IO no está configurado.`);
    }

    await transaction.commit();
    console.log("Transacción confirmada");

    // Responder al cliente
    res.status(201).json({
      message: "Evaluación, detalles y notificación creados exitosamente",
      evaluationMasterID: EvaluationMasterID,
    });
  } catch (error) {
    console.error("Error al crear la evaluación:", error);

    // Revertir la transacción si ocurrió un error
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
  try {
    const { id } = req.params;
    const { EvaluatorUserID, DateCreated, Comments, Details } = req.body;
    const RequesterID = req.userId; // ID del usuario solicitante
    const pool = await poolPromise;

    // Actualizar EvaluationMaster
    await pool
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("EvaluatorUserID", sql.Int, EvaluatorUserID)
      .input("DateCreated", sql.DateTime, DateCreated)
      .input("Comments", sql.Text, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateEvaluationMaster");

    // Actualizar los detalles de la evaluación
    for (const detail of Details) {
      await pool
        .request()
        .input("EvaluationMasterID", sql.Int, id)
        .input("ParameterID", sql.Int, detail.ParameterID)
        .input("CalificationID", sql.Int, detail.CalificationID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("UpdateEvaluationDetail");
    }

    res.status(200).json({ message: "Evaluación actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar evaluación:", error);
    res.status(500).json({ message: "Error al actualizar evaluación", error });
  }
};

const acknowledgeEvaluationMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { Comments } = req.body;
    const RequesterID = req.userId; // ID del usuario solicitante
    const pool = await poolPromise;

    // Actualizar EvaluationMaster
    await pool
      .request()
      .input("EvaluationMasterID", sql.Int, id)
      .input("Comments", sql.Text, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AcknowledgeEvaluationMaster");

    res.status(200).json({ message: "Evaluación aceptada exitosamente" });
  } catch (error) {
    console.error("Error al aceptar evaluación:", error);
    res.status(500).json({ message: "Error al aceptar evaluación", error });
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
  updateEvaluationMaster,
  acknowledgeEvaluationMaster,
};
