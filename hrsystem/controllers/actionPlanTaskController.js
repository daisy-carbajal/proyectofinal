const { poolPromise, sql } = require("../database/db");

const createActionPlanTask = async (req, res) => {
    try {
        const { ActionPlanID, Task, FollowUpDate, TaskStatus, CreatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanID', sql.Int, ActionPlanID)
            .input('Task', sql.VarChar(255), Task)
            .input('FollowUpDate', sql.Date, FollowUpDate)
            .input('TaskStatus', sql.VarChar(255), TaskStatus)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddActionPlanTask');
        
        res.status(201).json({ message: 'Tarea del plan de acción agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar la tarea del plan de acción', error });
    }
};

const getActionPlanTasksByActionPlanID = async (req, res) => {
    try {
        const { ActionPlanID } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('ActionPlanID', sql.Int, ActionPlanID)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetActionPlanTasksByActionPlanID');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas para este plan de acción' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas del plan de acción', error });
    }
};

const updateActionPlanTask = async (req, res) => {
    try {
        const { ActionPlanTaskID, Task, FollowUpDate, TaskStatus, UpdatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanTaskID', sql.Int, ActionPlanTaskID)
            .input('Task', sql.VarChar(255), Task)
            .input('FollowUpDate', sql.Date, FollowUpDate)
            .input('TaskStatus', sql.VarChar(255), TaskStatus)
            .input('UpdatedBy', sql.Int, UpdatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateActionPlanTask');
        
        res.status(200).json({ message: 'Tarea del plan de acción actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea del plan de acción', error });
    }
};

const deactivateActionPlanTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { DeletedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanTaskID', sql.Int, id)
            .input('DeletedBy', sql.Int, DeletedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateActionPlanTask');

        res.status(200).json({ message: 'Tarea del plan de acción desactivada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar la tarea del plan de acción', error });
    }
};

const deleteActionPlanTask = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanTaskID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteActionPlanTask');
        
        res.status(200).json({ message: 'Tarea del plan de acción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea del plan de acción', error });
    }
};

module.exports = {
    createActionPlanTask,
    getActionPlanTasksByActionPlanID,
    updateActionPlanTask,
    deactivateActionPlanTask,
    deleteActionPlanTask
};