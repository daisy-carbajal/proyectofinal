const { poolPromise, sql } = require("../database/db");

const createTypeFeedback = async (req, res) => {
  try {
    const { Description, Status } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.Bit, Status)
      .execute("AddTypeFeedback");

    res.status(201).json({ message: "Tipo de feedback creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el tipo de feedback:", err);
    res.status(500).json({ message: "Error al crear el tipo de feedback" });
  }
};

const getAllTypeFeedbacks = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("GetAllTypeFeedbacks");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los tipos de feedback:", err);
    res.status(500).json({ message: "Error al obtener los tipos de feedback" });
  }
};

const getTypeFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("TypeFeedbackID", sql.Int, id)
      .execute("GetTypeFeedbackById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Tipo de feedback no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el tipo de feedback:", err);
    res.status(500).json({ message: "Error al obtener el tipo de feedback" });
  }
};

const updateTypeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { Description, Status } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("TypeFeedbackID", sql.Int, id)
      .input("Description", sql.NVarChar, Description)
      .input("Status", sql.Bit, Status)
      .execute("UpdateTypeFeedback"); 

    res.status(200).json({ message: "Tipo de feedback actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el tipo de feedback:", err);
    res.status(500).json({ message: "Error al actualizar el tipo de feedback" });
  }
};

const deleteTypeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input("TypeFeedbackID", sql.Int, id)
      .execute("DeleteTypeFeedback"); 

    res.status(200).json({ message: "Tipo de feedback eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el tipo de feedback:", err);
    res.status(500).json({ message: "Error al eliminar el tipo de feedback" });
  }
};

module.exports = {
  createTypeFeedback,
  getAllTypeFeedbacks,
  getTypeFeedbackById,
  updateTypeFeedback,
  deleteTypeFeedback
};