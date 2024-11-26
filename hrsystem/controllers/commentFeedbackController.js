const { poolPromise, sql } = require("../database/db");

const createCommentFeedback = async (req, res) => {
  try {
    const { FeedbackID, UserID, Comment, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("FeedbackID", sql.Int, FeedbackID)
      .input("UserID", sql.Int, UserID)
      .input("Comment", sql.Text, Comment)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddCommentFeedback");
    res
      .status(201)
      .json({ message: "Comentario agregado exitosamente al feedback" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar comentario al feedback", error });
  }
};

const getCommentFeedbackByFeedbackID = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;

    console.log("FeedbackID recibido desde Postman:", id);
    console.log("RequesterID recibido desde middleware:", RequesterID);

    const pool = await poolPromise;
    console.log("Conexión al pool exitosa");

    const result = await pool
      .request()
      .input("FeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetCommentFeedbackByFeedbackID");

    console.log("Resultado del stored procedure:", result.recordset);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron comentarios para este feedback" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res
      .status(500)
      .json({ message: "Error al obtener comentarios del feedback", error });
  }
};


const updateCommentFeedback = async (req, res) => {
  try {
    const { CommentFeedbackID, Comment, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("CommentFeedbackID", sql.Int, CommentFeedbackID)
      .input("Comment", sql.Text, Comment)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateCommentFeedback");

    res.status(200).json({ message: "Comentario actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar comentario", error });
  }
};

const deactivateCommentFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("CommentFeedbackID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateCommentFeedback");

    res.status(200).json({ message: "Comentario desactivado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar comentario", error });
  }
};

const deleteCommentFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("CommentFeedbackID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteCommentFeedback");

    res.status(200).json({ message: "Comentario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar comentario", error });
  }
};

module.exports = {
  createCommentFeedback,
  getCommentFeedbackByFeedbackID,
  updateCommentFeedback,
  deactivateCommentFeedback,
  deleteCommentFeedback,
};