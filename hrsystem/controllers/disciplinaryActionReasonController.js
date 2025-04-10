const { poolPromise, sql } = require("../database/db");

const createDisciplinaryActionReason = async (req, res) => {
  try {
    const { Description } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool.request()
      .input("Description", sql.NVarChar, Description)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddDisciplinaryActionReason");

    res.status(201).json({ message: "Motivo de acción disciplinaria creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el motivo de acción disciplinaria:", err);
    res.status(500).json({ message: "Error al crear el motivo de acción disciplinaria" });
  }
};

const getAllDisciplinaryActionReasons = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllDisciplinaryActionReasons");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los motivos de acción disciplinaria:", err);
    res.status(500).json({ message: "Error al obtener los motivos de acción disciplinaria" });
  }
};

const getDisciplinaryActionReasonById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
      .input("DisciplinaryActionReasonID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetDisciplinaryActionReasonById"); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Motivo de acción disciplinaria no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el motivo de acción disciplinaria:", err);
    res.status(500).json({ message: "Error al obtener el motivo de acción disciplinaria" });
  }
};

const updateDisciplinaryActionReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { Description } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("DisciplinaryActionReasonID", sql.Int, id)
      .input("Description", sql.NVarChar, Description)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateDisciplinaryActionReason"); 

    res.status(200).json({ message: "Motivo de acción disciplinaria actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el motivo de acción disciplinaria:", err);
    res.status(500).json({ message: "Error al actualizar el motivo de acción disciplinaria" });
  }
};

const deleteDisciplinaryActionReason = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool.request()
      .input("DisciplinaryActionReasonID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteDisciplinaryActionReason");

    res.status(200).json({ message: "Motivo de acción disciplinaria eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el motivo de acción disciplinaria:", err);
    res.status(500).json({ message: "Error al eliminar el motivo de acción disciplinaria" });
  }
};

module.exports = {
  createDisciplinaryActionReason,
  getAllDisciplinaryActionReasons,
  getDisciplinaryActionReasonById,
  updateDisciplinaryActionReason,
  deleteDisciplinaryActionReason
};