const { poolPromise, sql } = require("../database/db");

const createActionPlan = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);
  try {
    const {
      AppliedByUserID,
      EmployeeUserID,
      FocusArea,
      StartDate,
      EndDate,
      ActionPlanStatus,
      Summary,
      Goal,
      SuccessArea,
      OpportunityArea,
      Impact,
      RootCauseAnalysis,
      Strategies,
      Comments,
      Parameters, 
      Tasks, 
    } = req.body;
    const RequesterID = req.userId;

    await transaction.begin();

    const result = await transaction
      .request()
      .input("AppliedByUserID", sql.Int, AppliedByUserID)
      .input("EmployeeUserID", sql.Int, EmployeeUserID)
      .input("FocusArea", sql.VarChar(255), FocusArea)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("ActionPlanStatus", sql.VarChar(50), ActionPlanStatus)
      .input("Summary", sql.Text, Summary)
      .input("Goal", sql.Text, Goal)
      .input("SuccessArea", sql.Text, SuccessArea)
      .input("OpportunityArea", sql.Text, OpportunityArea)
      .input("Impact", sql.Text, Impact)
      .input("RootCauseAnalysis", sql.Text, RootCauseAnalysis)
      .input("Strategies", sql.Text, Strategies)
      .input("Comments", sql.Text, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddActionPlan");

    const ActionPlanID = result.recordset[0].ActionPlanID;

    for (const parameter of Parameters) {
      await transaction
        .request()
        .input("ActionPlanID", sql.Int, ActionPlanID)
        .input("ParameterID", sql.Int, parameter.ParameterID)
        .input(
          "CurrentCalificationID",
          sql.Int,
          parameter.CurrentCalificationID
        )
        .input("GoalCalificationID", sql.Int, parameter.GoalCalificationID)
        .input("GoalStatus", sql.VarChar(100), parameter.GoalStatus)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddActionPlanParameter");
    }

    for (const task of Tasks) {
      await transaction
        .request()
        .input("ActionPlanID", sql.Int, ActionPlanID)
        .input("Task", sql.VarChar(255), task.Task)
        .input("FollowUpDate", sql.Date, task.FollowUpDate)
        .input("TaskStatus", sql.VarChar(255), task.TaskStatus)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddActionPlanTask");
    }

    await transaction.commit();

    res
      .status(201)
      .json({ message: "Plan de acción y detalles agregados exitosamente" });
  } catch (error) {

    await transaction.rollback();
    console.error("Error al crear el plan de acción y sus detalles:", error);
    res
      .status(500)
      .json({ message: "Error al crear el plan de acción y sus detalles" });
  }
};

const getAllActionPlans = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllActionPlans");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron planes de acción" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los planes de acción", error });
  }
};

const getActionPlansByUserID = async (req, res) => {
  try {
    const { UserID } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetActionPlansByUserID");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "No se encontraron planes de acción para el usuario",
      });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los planes de acción del usuario",
      error,
    });
  }
};

const updateActionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Summary,
      Goal,
      SuccessArea,
      OpportunityArea,
      Impact,
      RootCauseAnalysis,
      EndDate,
      ActionPlanStatus,
      Strategies,
      Comments,
      Parameters,
      Tasks,
    } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ActionPlanID", sql.Int, id)
      .input("Summary", sql.Text, Summary)
      .input("Goal", sql.Text, Goal)
      .input("SuccessArea", sql.Text, SuccessArea)
      .input("OpportunityArea", sql.Text, OpportunityArea)
      .input("Impact", sql.Text, Impact)
      .input("RootCauseAnalysis", sql.Text, RootCauseAnalysis)
      .input("EndDate", sql.Date, EndDate)
      .input("ActionPlanStatus", sql.NVarChar, ActionPlanStatus)
      .input("Strategies", sql.Text, Strategies)
      .input("Comments", sql.Text, Comments)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateActionPlan");

    for (const parameter of Parameters) {
      await pool
        .request()
        .input("ActionPlanID", sql.Int, id)
        .input("ParameterID", sql.Int, parameter.ParameterID)
        .input("GoalCalificationID", sql.Int, parameter.GoalCalificationID)
        .input("GoalStatus", sql.NVarChar, parameter.GoalStatus)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("UpdateActionPlanParameter");
    }

    for (const task of Tasks) {
      await pool
        .request()
        .input("ActionPlanID", sql.Int, id)
        .input("ActionPlanTaskID", sql.Int, task.TaskID)
        .input("Task", sql.NVarChar, task.Task)
        .input("FollowUpDate", sql.Date, task.FollowUpDate)
        .input("TaskStatus", sql.NVarChar, task.TaskStatus)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("UpdateActionPlanTask");
    }

    res
      .status(200)
      .json({ message: "Plan de mejora actualizado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el plan de mejora", error });
  }
};

const deactivateActionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ActionPlanID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateActionPlan");

    res
      .status(200)
      .json({ message: "Plan de acción desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar el plan de acción", error });
  }
};

const deleteActionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ActionPlanID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteActionPlan");

    res.status(200).json({ message: "Plan de acción eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el plan de acción", error });
  }
};

const getActionPlanWithDetailsByID = async (req, res) => {
  try {
    const { id } = req.params; 
    const RequesterID = req.userId; 
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("ActionPlanID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetActionPlanInformationByID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró ningún plan de acción con ese ID." });
    }

    const processedRecord = result.recordset.map((actionPlan) => {
      if (actionPlan.Parameters) {
        try {
          if (typeof actionPlan.Parameters === "string") {
            actionPlan.Parameters = JSON.parse(actionPlan.Parameters);
          }
        } catch (parseError) {
          console.error("Error al parsear Parameters:", parseError);
        }
      }

      if (actionPlan.Tasks) {
        try {
          if (typeof actionPlan.Tasks === "string") {
            actionPlan.Tasks = JSON.parse(actionPlan.Tasks);
          }
        } catch (parseError) {
          console.error("Error al parsear Tasks:", parseError);
        }
      }

      return actionPlan;
    });

    res.status(200).json(processedRecord[0]);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el plan de acción", error });
  }
};

const acknowledgeActionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ActionPlanID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AcknowledgeActionPlan");

    res.status(200).json({ message: "Plan de Mejora aceptado exitosamente" });
  } catch (err) {
    console.error("Error al aceptar plan de mejora:", err);
    res.status(500).json({ message: "Error al aceptar lplan de mejora." });
  }
};

module.exports = {
  createActionPlan,
  getAllActionPlans,
  getActionPlansByUserID,
  updateActionPlan,
  deactivateActionPlan,
  deleteActionPlan,
  getActionPlanWithDetailsByID,
  acknowledgeActionPlan,
};
