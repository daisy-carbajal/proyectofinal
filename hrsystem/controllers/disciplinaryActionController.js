const { poolPromise, sql } = require("../database/db");

const createDisciplinaryAction = async (req, res) => {
  try {
    const {
      DisciplinaryActionReasonID,
      UserID,
      ReportedByUserID,
      DepartmentID,
      JobTitleID,
      WarningID,
      Description,
      EsignatureUser,
      EsignatureManager,
      CreatedBy,
    } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("DisciplinaryActionReasonID", sql.Int, DisciplinaryActionReasonID)
      .input("UserID", sql.Int, UserID)
      .input("ReportedByUserID", sql.Int, ReportedByUserID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("WarningID", sql.Int, WarningID)
      .input("Description", sql.Text, Description)
      .input("EsignatureUser", sql.VarBinary, EsignatureUser)
      .input("EsignatureManager", sql.VarBinary, EsignatureManager)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddDisciplinaryAction");

    res
      .status(201)
      .json({ message: "Acción disciplinaria creada exitosamente" });
  } catch (err) {
    console.error("Error al crear la acción disciplinaria:", err);
    res.status(500).json({ message: "Error al crear la acción disciplinaria" });
  }
};

const getAllDisciplinaryActions = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllDisciplinaryActions");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las acciones disciplinarias:", err);
    res
      .status(500)
      .json({ message: "Error al obtener las acciones disciplinarias" });
  }
};

const getDisciplinaryActionByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("[GetDisciplinaryActionsByUserID]");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Acción disciplinaria no encontrada" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener la acción disciplinaria:", err);
    res
      .status(500)
      .json({ message: "Error al obtener la acción disciplinaria" });
  }
};

const updateDisciplinaryAction = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      DisciplinaryActionReasonID,
      UserID,
      ReportedByUserID,
      DepartmentID,
      JobTitleID,
      WarningID,
      Description,
      EsignatureUser,
      EsignatureManager,
      UpdatedBy,
    } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("DisciplinaryActionID", sql.Int, id)
      .input("DisciplinaryActionReasonID", sql.Int, DisciplinaryActionReasonID)
      .input("UserID", sql.Int, UserID)
      .input("ReportedByUserID", sql.Int, ReportedByUserID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("WarningID", sql.Int, WarningID)
      .input("Description", sql.Text, Description)
      .input("EsignatureUser", sql.VarBinary, EsignatureUser)
      .input("EsignatureManager", sql.VarBinary, EsignatureManager)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateDisciplinaryAction");

    res
      .status(200)
      .json({ message: "Acción disciplinaria actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar la acción disciplinaria:", err);
    res
      .status(500)
      .json({ message: "Error al actualizar la acción disciplinaria" });
  }
};

const deactivateDisciplinaryAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("DisciplinaryActionID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateDisciplinaryAction");

    res
      .status(200)
      .json({ message: "Acción disciplinaria desactivada exitosamente" });
  } catch (err) {
    console.error("Error al desactivar la acción disciplinaria:", err);
    res
      .status(500)
      .json({ message: "Error al desactivar la acción disciplinaria" });
  }
};

const deleteDisciplinaryAction = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("DisciplinaryActionID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteDisciplinaryAction");

    res
      .status(200)
      .json({ message: "Acción disciplinaria eliminada permanentemente" });
  } catch (err) {
    console.error("Error al eliminar la acción disciplinaria:", err);
    res
      .status(500)
      .json({ message: "Error al eliminar la acción disciplinaria" });
  }
};

module.exports = {
  createDisciplinaryAction,
  getAllDisciplinaryActions,
  getDisciplinaryActionByUserId,
  updateDisciplinaryAction,
  deactivateDisciplinaryAction,
  deleteDisciplinaryAction,
};
