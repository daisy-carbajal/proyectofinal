const { poolPromise } = require("../database/db");

const getActiveIncidentsCount = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .execute("GetActiveIncidentsCount");

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el conteo de incidentes activos:", err);
    res.status(500).json({ message: "Error al obtener el conteo de incidentes activos" });
  }
};

const getUnreviewedEvaluationsCount = async (req, res) => {
    try {
      const pool = await poolPromise;
  
      const result = await pool.request()
        .execute("GetUnreviewedEvaluationsCount");
  
      res.status(200).json(result.recordset[0]);
    } catch (err) {
      console.error("Error al obtener el conteo de evaluaciones no revisadas:", err);
      res.status(500).json({ message: "Error al obtener el conteo de evaluaciones no revisadas" });
    }
  };

const getUnacknowledgedDisciplinaryActionsCount = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .execute("GetUnacknowledgedDisciplinaryActionsCount");

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el conteo de acciones disciplinarias no reconocidas:", err);
    res.status(500).json({ message: "Error al obtener el conteo de acciones disciplinarias no reconocidas" });
  }
};

const getTodayCommentFeedbackCount = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .execute("GetTodayCommentFeedbackCount");

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el conteo de comentarios creados hoy:", err);
    res.status(500).json({ message: "Error al obtener el conteo de comentarios creados hoy" });
  }
};

module.exports = {
  getActiveIncidentsCount,
  getUnreviewedEvaluationsCount,
  getUnacknowledgedDisciplinaryActionsCount,
  getTodayCommentFeedbackCount
};