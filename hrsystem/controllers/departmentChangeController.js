const { poolPromise, sql } = require("../database/db");

const createDepartmentChange = async (req, res) => {
  try {
    const { UserID, DepartmentID, StartDate, CreatedBy, ChangeReasonID } =
      req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("StartDate", sql.Date, StartDate)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("ChangeReasonID", sql.Int, ChangeReasonID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddDepartmentChange");

    res
      .status(201)
      .json({ message: "Cambio de departamento creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el cambio de departamento:", err);
    res
      .status(500)
      .json({ message: "Error al crear el cambio de departamento" });
  }
};

const getAllDepartmentChanges = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllDepartmentChanges");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los cambios de departamento:", err);
    res
      .status(500)
      .json({ message: "Error al obtener los cambios de departamento" });
  }
};

const getDepartmentChangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetDepartmentChangesByUserId");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({
          message: "Cambio de departamento para usuario no encontrados",
        });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el cambio de departamento:", err);
    res
      .status(500)
      .json({ message: "Error al obtener el cambio de departamento" });
  }
};

const updateStartDateDepartmentChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { StartDate, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("DepartmentChangeID", sql.Int, id)
      .input("StartDate", sql.Date, StartDate)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateDepartmentChange");

    res
      .status(200)
      .json({ message: "Cambio de departamento actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el cambio de departamento:", err);
    res
      .status(500)
      .json({ message: "Error al actualizar el cambio de departamento" });
  }
};

const deactivateDepartmentChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("DepartmentChangeID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateDepartmentChange");

    res
      .status(200)
      .json({ message: "Cambio de departamento desactivado exitosamente" });
  } catch (err) {
    console.error("Error al desactivar el cambio de departamento:", err);
    res
      .status(500)
      .json({ message: "Error al desactivar el cambio de departamento" });
  }
};

const approveDepartmentChange = async (req, res) => {
  try {
    const { departmentChangeId, userId } = req.body;
    const requesterId = req.userId;

    const pool = await poolPromise;

    await pool.request()
      .input("DepartmentChangeID", sql.Int, departmentChangeId)
      .input("UserID", sql.Int, userId)
      .input("RequesterID", sql.Int, requesterId)
      .execute("ApproveDepartmentChange");

    res.status(200).json({ message: "Cambio de departamento aprobado exitosamente" });
  } catch (err) {
    console.error("Error al aprobar cambio de departamento:", err);
    res.status(500).json({ message: "Error al aprobar cambio de departamento" });
  }
};

const denyDepartmentChange = async (req, res) => {
  try {
    const { departmentChangeId, userId } = req.body;
    const requesterId = req.userId;

    const pool = await poolPromise;

    await pool.request()
      .input("DepartmentChangeID", sql.Int, departmentChangeId)
      .input("UserID", sql.Int, userId)
      .input("RequesterID", sql.Int, requesterId)
      .execute("DenyDepartmentChange");

    res.status(200).json({ message: "Cambio de departamento denegado exitosamente" });
  } catch (err) {
    console.error("Error al denegar cambio de departamento:", err);
    res.status(500).json({ message: "Error al denegar cambio de departamento" });
  }
};

module.exports = {
  createDepartmentChange,
  getAllDepartmentChanges,
  getDepartmentChangeById,
  updateStartDateDepartmentChange,
  deactivateDepartmentChange,
  approveDepartmentChange,
  denyDepartmentChange
};
