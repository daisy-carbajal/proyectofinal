const { poolPromise, sql } = require("../database/db");

const createFeedback = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const { UserID, TypeID, Subject, Comment, Acknowledged } = req.body;
    const RequesterID = req.userId;

    await transaction
      .input("UserID", sql.Int, UserID)
      .input("TypeID", sql.Int, TypeID)
      .input("Subject", sql.NVarChar, Subject)
      .input("Comment", sql.Text, Comment)
      .input("Acknowledged", sql.Bit, Acknowledged)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddFeedback");

    const nameResult = await transaction
      .request()
      .input("UserID", sql.Int, UserID)
      .execute("GetUserName");

    const employeeName = nameResult.recordset[0]?.FullName;

    if (!evaluateeName) {
      throw new Error("No se pudo obtener el nombre del EvaluateeUserID");
    }

    const preferencesResult = await transaction
      .request()
      .input("UserID", sql.Int, UserID)
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
    const emailNotificationMessage = `
  ${evaluateeName}, se ha creado una nueva evaluación para usted. Puede revisarla en el sistema.<br>
  <a href="http://localhost:4200/home/evaluation/details/${EvaluationMasterID}" target="_blank">
    Revisar evaluación
  </a>`;
  
    const pushNotificationMessage = `
  ${evaluateeName}, se ha creado una nueva evaluación para usted. Puede revisarla en el sistema.`;

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

    res.status(201).json({ message: "Feedback creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el feedback:", err);
    res.status(500).json({ message: "Error al crear el feedback" });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllFeedbacks");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los feedbacks:", err);
    res.status(500).json({ message: "Error al obtener los feedbacks" });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool
      .request()
      .input("FeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetFeedbackById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Feedback no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el feedback:", err);
    res.status(500).json({ message: "Error al obtener el feedback" });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { TypeID, Subject, Comment, UpdatedBy } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    await pool
      .request()
      .input("FeedbackID", sql.Int, id)
      .input("Comment", sql.Text, Comment)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateFeedback");

    res.status(200).json({ message: "Feedback actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el feedback:", err);
    res.status(500).json({ message: "Error al actualizar el feedback" });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("FeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteFeedback");

    res.status(200).json({ message: "Feedback eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el feedback:", err);
    res.status(500).json({ message: "Error al eliminar el feedback" });
  }
};

const deactivateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("FeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateFeedback");

    res.status(200).json({ message: "Feedback desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar el feedback:", err);
    res.status(500).json({ message: "Error al desactivar el feedback" });
  }
};

const acknowledgeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("FeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AcknowledgeFeedback");

    res.status(200).json({ message: "Feedback revisado exitosamente" });
  } catch (err) {
    console.error("Error al revisar el feedback:", err);
    res.status(500).json({ message: "Error al revisar el feedback" });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  deactivateFeedback,
  acknowledgeFeedback,
};
