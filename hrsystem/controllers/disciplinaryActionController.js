const { poolPromise, sql } = require("../database/db");

const createDisciplinaryAction = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);
  try {
    const {
      DisciplinaryActionReasonID,
      UserID,
      ReportedByUserID,
      WarningID,
      Description,
      ActionTaken,
      DateApplied,
      Tasks,
    } = req.body;
    const RequesterID = req.userId;

    await transaction.begin();

    const result = await transaction
      .request()
      .input("DisciplinaryActionReasonID", sql.Int, DisciplinaryActionReasonID)
      .input("UserID", sql.Int, UserID)
      .input("ReportedByUserID", sql.Int, ReportedByUserID)
      .input("WarningID", sql.Int, WarningID)
      .input("Description", sql.Text, Description)
      .input("ActionTaken", sql.Text, ActionTaken)
      .input("DateApplied", sql.DateTime, DateApplied)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddDisciplinaryAction");

    const DisciplinaryActionID = result.recordset[0].DisciplinaryActionID;

    for (const task of Tasks) {
      await transaction
        .request()
        .input("DisciplinaryActionID", sql.Int, DisciplinaryActionID)
        .input("Task", sql.VarChar(255), task.Task)
        .input("FollowUpDate", sql.Date, task.FollowUpDate)
        .input("TaskStatus", sql.VarChar(255), task.TaskStatus)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddDisciplinaryActionTask");
    }

    await transaction.commit();

    res
      .status(201)
      .json({ message: "Acción disciplinaria y tareas creadas exitosamente" });
  } catch (err) {
    await transaction.rollback();
    console.error("Error al crear la acción disciplinaria y sus tareas:", err);
    res
      .status(500)
      .json({ message: "Error al crear la acción disciplinaria y sus tareas" });
  }
};

const getAllDisciplinaryActions = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;
    const result = await pool
      .request()
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
    const { DisciplinaryActionReasonID, Description, ActionTaken, Tasks } =
      req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("DisciplinaryActionID", sql.Int, id)
      .input("DisciplinaryActionReasonID", sql.Int, DisciplinaryActionReasonID)
      .input("Description", sql.Text, Description)
      .input("ActionTaken", sql.Text, ActionTaken)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateDisciplinaryAction");

    for (const task of Tasks) {
      await pool
        .request()
        .input(
          "DisciplinaryActionTaskID",
          sql.Int,
          task.DisciplinaryActionTaskID
        )
        .input("Task", sql.VarChar(255), task.Task)
        .input("FollowUpDate", sql.Date, task.FollowUpDate)
        .input("TaskStatus", sql.VarChar(255), task.TaskStatus)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("UpdateDisciplinaryActionTask");
    }

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

const getDisciplinaryActionWithTasksByID = async (req, res) => {
  try {
    const { id } = req.params; // ID de la acción disciplinaria
    const RequesterID = req.userId; // ID del usuario solicitante
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("DisciplinaryActionID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetDisciplinaryActionWithTasksByID");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "No se encontraron acciones disciplinarias con ese ID.",
      });
    }

    // Procesar el registro devuelto (si Tasks está en formato JSON, asegúrate de parsearlo)
    const processedRecord = result.recordset.map((disciplinaryAction) => {
      if (disciplinaryAction.Tasks) {
        try {
          // Verificar si Tasks es una cadena JSON y parsearla
          if (typeof disciplinaryAction.Tasks === "string") {
            disciplinaryAction.Tasks = JSON.parse(disciplinaryAction.Tasks);
          }
        } catch (parseError) {
          console.error("Error al parsear Tasks:", parseError);
        }
      }
      return disciplinaryAction;
    });

    res.status(200).json(processedRecord[0]); // Enviar solo el primer registro
  } catch (error) {
    console.error("Error en la consulta:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la acción disciplinaria", error });
  }
};

const acknowledgeDisciplinaryAction = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("DisciplinaryActionID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AcknowledgeDisciplinaryAction");

    res
      .status(200)
      .json({ message: "Acción disciplinaria aceptada exitosamente" });
  } catch (err) {
    console.error("Error al desactivar la acción disciplinaria:", err);
    res
      .status(500)
      .json({ message: "Error al aceptar la acción disciplinaria" });
  }
};

module.exports = {
  createDisciplinaryAction,
  getAllDisciplinaryActions,
  getDisciplinaryActionByUserId,
  updateDisciplinaryAction,
  deactivateDisciplinaryAction,
  deleteDisciplinaryAction,
  getDisciplinaryActionWithTasksByID,
  acknowledgeDisciplinaryAction,
};
