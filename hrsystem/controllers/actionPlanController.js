const { poolPromise, sql } = require("../database/db");

const createActionPlan = async (req, res) => {
    const transaction = new sql.Transaction(await poolPromise);
    try {
        const {
            CreatorUserID,
            EmployeeUserID,
            DepartmentID,
            TimePeriod,
            FocusArea,
            StartDate,
            EndDate,
            ActionPlanStatus,
            Acknowledgement,
            Signature,
            Summary,
            Goal,
            SuccessArea,
            OpportunityArea,
            Impact,
            RootCauseAnalysis,
            Comments,
            CreatedBy,
            Parameters, // Lista de parámetros para ActionPlanParameter
            Tasks // Lista de tareas para ActionPlanTask
        } = req.body;
        const RequesterID = req.userId;

        // Iniciar una transacción
        await transaction.begin();

        // Insertar el registro en ActionPlan
        const result = await transaction.request()
            .input('CreatorUserID', sql.Int, CreatorUserID)
            .input('EmployeeUserID', sql.Int, EmployeeUserID)
            .input('DepartmentID', sql.Int, DepartmentID)
            .input('TimePeriod', sql.Int, TimePeriod)
            .input('FocusArea', sql.VarChar(255), FocusArea)
            .input('StartDate', sql.Date, StartDate)
            .input('EndDate', sql.Date, EndDate)
            .input('ActionPlanStatus', sql.VarChar(50), ActionPlanStatus)
            .input('Acknowledgement', sql.Bit, Acknowledgement)
            .input('Signature', sql.VarBinary(sql.MAX), Signature)
            .input('Summary', sql.Text, Summary)
            .input('Goal', sql.Text, Goal)
            .input('SuccessArea', sql.Text, SuccessArea)
            .input('OpportunityArea', sql.Text, OpportunityArea)
            .input('Impact', sql.Text, Impact)
            .input('RootCauseAnalysis', sql.Text, RootCauseAnalysis)
            .input('Comments', sql.Text, Comments)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddActionPlan');

        // Obtener el ID del plan de acción recién creado
        const ActionPlanID = result.recordset[0].ActionPlanID;

        // Insertar múltiples registros en ActionPlanParameter
        for (const parameter of Parameters) {
            await transaction.request()
                .input('ActionPlanID', sql.Int, ActionPlanID)
                .input('CurrentParameterID', sql.Int, parameter.CurrentParameterID)
                .input('CurrentParameterScore', sql.Int, parameter.CurrentParameterScore)
                .input('GoalParameterID', sql.Int, parameter.GoalParameterID)
                .input('GoalParameterScore', sql.Int, parameter.GoalParameterScore)
                .input('GoalAcquired', sql.Bit, parameter.GoalAcquired)
                .input('GoalStatus', sql.VarChar(100), parameter.GoalStatus)
                .input('CreatedBy', sql.Int, CreatedBy)
                .input('RequesterID', sql.Int, RequesterID)
                .execute('AddActionPlanParameter');
        }

        // Insertar múltiples registros en ActionPlanTask
        for (const task of Tasks) {
            await transaction.request()
                .input('ActionPlanID', sql.Int, ActionPlanID)
                .input('Task', sql.VarChar(255), task.Task)
                .input('FollowUpDate', sql.Date, task.FollowUpDate)
                .input('TaskStatus', sql.VarChar(255), task.TaskStatus)
                .input('CreatedBy', sql.Int, CreatedBy)
                .input('RequesterID', sql.Int, RequesterID)
                .execute('AddActionPlanTask');
        }

        // Confirmar la transacción
        await transaction.commit();

        res.status(201).json({ message: 'Plan de acción y detalles agregados exitosamente' });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error("Error al crear el plan de acción y sus detalles:", error);
        res.status(500).json({ message: 'Error al crear el plan de acción y sus detalles' });
    }
};

const getAllActionPlans = async (req, res) => {
    try {
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetAllActionPlans');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron planes de acción' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los planes de acción', error });
    }
};

const getActionPlansByUserID = async (req, res) => {
    try {
        const { UserID } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetActionPlansByUserID');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron planes de acción para el usuario' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los planes de acción del usuario', error });
    }
};

const updateActionPlan = async (req, res) => {
    try {
        const {
            ActionPlanID,
            TimePeriod,
            FocusArea,
            StartDate,
            EndDate,
            ActionPlanStatus,
            Acknowledgement,
            Summary,
            Goal,
            SuccessArea,
            OpportunityArea,
            Impact,
            RootCauseAnalysis,
            Comments,
            UpdatedBy
        } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanID', sql.Int, ActionPlanID)
            .input('TimePeriod', sql.Int, TimePeriod)
            .input('FocusArea', sql.VarChar(255), FocusArea)
            .input('StartDate', sql.Date, StartDate)
            .input('EndDate', sql.Date, EndDate)
            .input('ActionPlanStatus', sql.VarChar(50), ActionPlanStatus)
            .input('Acknowledgement', sql.Bit, Acknowledgement)
            .input('Summary', sql.Text, Summary)
            .input('Goal', sql.Text, Goal)
            .input('SuccessArea', sql.Text, SuccessArea)
            .input('OpportunityArea', sql.Text, OpportunityArea)
            .input('Impact', sql.Text, Impact)
            .input('RootCauseAnalysis', sql.Text, RootCauseAnalysis)
            .input('Comments', sql.Text, Comments)
            .input('UpdatedBy', sql.Int, UpdatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateActionPlan');
        
        res.status(200).json({ message: 'Plan de acción actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el plan de acción', error });
    }
};

const deactivateActionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { DeletedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanID', sql.Int, id)
            .input('DeletedBy', sql.Int, DeletedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateActionPlan');

        res.status(200).json({ message: 'Plan de acción desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el plan de acción', error });
    }
};

const deleteActionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteActionPlan');
        
        res.status(200).json({ message: 'Plan de acción eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el plan de acción', error });
    }
};

module.exports = {
    createActionPlan,
    getAllActionPlans,
    getActionPlansByUserID,
    updateActionPlan,
    deactivateActionPlan,
    deleteActionPlan
};