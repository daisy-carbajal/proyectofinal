const { poolPromise, sql } = require("../database/db");

const createFeedback = async (req, res) => {
  try {
    const { UserID, TypeID, Subject, Comment, Acknowledged } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("TypeID", sql.Int, TypeID)
      .input("Subject", sql.NVarChar, Subject)
      .input("Comment", sql.Text, Comment)
      .input("Acknowledged", sql.Bit, Acknowledged)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddFeedback"); 

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
    const result = await pool.request()
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
    const result = await pool.request()
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

    await pool.request()
      .input("FeedbackID", sql.Int, id)
      .input("TypeID", sql.Int, TypeID)
      .input("Subject", sql.NVarChar, Subject)
      .input("Comment", sql.Text, Comment)
      .input("UpdatedBy", sql.Int, UpdatedBy)
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
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("FeedbackID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
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

    await pool.request()
      .input("FeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateFeedback");

    res.status(200).json({ message: "Feedback desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar el feedback:", err);
    res.status(500).json({ message: "Error al desactivar el feedback" });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  deactivateFeedback
};