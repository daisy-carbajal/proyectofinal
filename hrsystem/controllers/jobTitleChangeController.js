const { poolPromise, sql } = require("../database/db");

const createJobTitleChange = async (req, res) => {
  try {
    const { UserID, JobTitleID, StartDate, CreatedBy, ChangeReasonID } =
      req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("StartDate", sql.Date, StartDate)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("ChangeReasonID", sql.Int, ChangeReasonID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddJobTitleChange");

    res
      .status(201)
      .json({ message: "Cambio de título de trabajo creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el cambio de título de trabajo:", err);
    res
      .status(500)
      .json({ message: "Error al crear el cambio de título de trabajo" });
  }
};

const getAllJobTitleChanges = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllJobTitleChanges");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los cambios de título de trabajo:", err);
    res
      .status(500)
      .json({ message: "Error al obtener los cambios de título de trabajo" });
  }
};

const getJobTitleChangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("JobTitleChangeID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetJobTitleChangesByUserID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Cambio de título de trabajo no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener el cambio de título de trabajo:", err);
    res
      .status(500)
      .json({ message: "Error al obtener el cambio de título de trabajo" });
  }
};

const updateJobTitleChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { JobTitleID, StartDate, EndDate, Status, UpdatedBy } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    await pool
      .request()
      .input("JobTitleChangeID", sql.Int, id)
      .input("JobTitleID", sql.Int, JobTitleID)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("Status", sql.Bit, Status)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateJobTitleChange");

    res.status(200).json({
      message: "Cambio de título de trabajo actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error al actualizar el cambio de título de trabajo:", err);
    res
      .status(500)
      .json({ message: "Error al actualizar el cambio de título de trabajo" });
  }
};

const deactivateJobTitleChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    await pool
      .request()
      .input("JobTitleChangeID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateJobTitleChange");

    res.status(200).json({
      message: "Cambio de título de trabajo desactivado exitosamente",
    });
  } catch (err) {
    console.error("Error al desactivar el cambio de título de trabajo:", err);
    res
      .status(500)
      .json({ message: "Error al desactivar el cambio de título de trabajo" });
  }
};

const approveChanges = async (req, res) => {
  try {
    const { UserID, DepartmentChangeID, JobTitleChangeID, HierarchyID } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    if (DepartmentChangeID) {
      await pool
        .request()
        .input("UserID", sql.Int, UserID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("RevokeDepartmentChange");
    }

    if (JobTitleChangeID) {
      await pool
        .request()
        .input("UserID", sql.Int, UserID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("RevokeJobTitleChange");
    }

    if (HierarchyID) {
      await pool
        .request()
        .input("UserID", sql.Int, UserID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("RevokeUserHierarchy");
    }

    await pool
      .request()
      .input("DepartmentChangeID", sql.Int, DepartmentChangeID || null) // Puede ser null
      .input("JobTitleChangeID", sql.Int, JobTitleChangeID || null) // Puede ser null
      .input("HierarchyID", sql.Int, HierarchyID || null) // Puede ser null
      .input("UserID", sql.Int, UserID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("ApproveChanges");

    res.status(200).json({ message: "Cambios aprobados exitosamente." });
  } catch (error) {
    console.error("Error al aprobar cambios:", error);
    res.status(500).json({ error: "Ocurrió un error al aprobar los cambios." });
  }
};

const denyChanges = async (req, res) => {
  try {
    const { UserID, DepartmentChangeID, JobTitleChangeID, HierarchyID } = req.body;
    const RequesterID = req.userId;

    const pool = await poolPromise;

    await pool
      .request()
      .input("DepartmentChangeID", sql.Int, DepartmentChangeID || null) // Puede ser null
      .input("JobTitleChangeID", sql.Int, JobTitleChangeID || null) // Puede ser null
      .input("HierarchyID", sql.Int, HierarchyID || null) // Puede ser null
      .input("UserID", sql.Int, UserID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DenyChanges");

    res.status(200).json({ message: "Cambios denegados exitosamente." });
  } catch (error) {
    console.error("Error al denegar cambios:", error);
    res.status(500).json({ error: "Ocurrió un error al denegar los cambios." });
  }
};

const getPendingChanges = async (req, res) => {
  try {
    const requesterId = req.userId;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, requesterId)
      .execute("GetPendingChanges");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los cambios pendientes:", err);
    if (err.message.includes("Access denied")) {
      return res.status(403).json({
        message: "No tienes permiso para ver los cambios pendientes.",
      });
    }
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const getPendingChangesByID = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterId = req.userId;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterId)
      .execute("GetPendingChangesByID");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los cambios pendientes:", err);
    if (err.message.includes("Access denied")) {
      return res.status(403).json({
        message: "No tienes permiso para ver los cambios pendientes.",
      });
    }
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const getCurrentDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterId = req.userId;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterId)
      .execute("GetCurrentDetailsByID");

    res.status(200).json(result.recordset); // Devolver los resultados al cliente
  } catch (err) {
    console.error("Error al obtener los detalles actuales:", err);
    if (err.message.includes("Access denied")) {
      return res.status(403).json({
        message: "No tienes permiso para ver los detalles actuales.",
      });
    }
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

module.exports = {
  createJobTitleChange,
  getAllJobTitleChanges,
  getJobTitleChangeById,
  updateJobTitleChange,
  deactivateJobTitleChange,
  approveChanges,
  denyChanges,
  getPendingChanges,
  getPendingChangesByID,
  getCurrentDetailsByID
};
