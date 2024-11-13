const { poolPromise, sql } = require("../database/db");

const createDisciplinaryActionTask = async (req, res) => {
    try {
        const { DisciplinaryActionID, Task, FollowUpDate, TaskStatus, CreatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('DisciplinaryActionID', sql.Int, DisciplinaryActionID)
            .input('Task', sql.VarChar(255), Task)
            .input('FollowUpDate', sql.Date, FollowUpDate)
            .input('TaskStatus', sql.VarChar(255), TaskStatus)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddDisciplinaryActionTask');
        
        res.status(201).json({ message: 'Tarea de acción disciplinaria agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar la tarea de acción disciplinaria', error });
    }
};

const getAllDisciplinaryActionTasks = async (req, res) => {
    try {
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetAllDisciplinaryActionTasks');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas de acciones disciplinarias' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas de acciones disciplinarias', error });
    }
};

const getAllDisciplinaryActionTasksByDAID = async (req, res) => {
    try {
        const { DisciplinaryActionID } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('DisciplinaryActionID', sql.Int, DisciplinaryActionID)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetAllDisciplinaryActionTasksByDAID');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas para esta acción disciplinaria' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas de la acción disciplinaria', error });
    }
};

const updateDisciplinaryActionTask = async (req, res) => {
    try {
        const { DisciplinaryActionTaskID, Task, FollowUpDate, TaskStatus, UpdatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('DisciplinaryActionTaskID', sql.Int, DisciplinaryActionTaskID)
            .input('Task', sql.VarChar(255), Task)
            .input('FollowUpDate', sql.Date, FollowUpDate)
            .input('TaskStatus', sql.VarChar(255), TaskStatus)
            .input('UpdatedBy', sql.Int, UpdatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateDisciplinaryActionTask');
        
        res.status(200).json({ message: 'Tarea de acción disciplinaria actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea de acción disciplinaria', error });
    }
};

const deactivateDisciplinaryActionTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { DeletedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('DisciplinaryActionTaskID', sql.Int, id)
            .input('DeletedBy', sql.Int, DeletedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateDisciplinaryActionTask');

        res.status(200).json({ message: 'Tarea de acción disciplinaria desactivada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar la tarea de acción disciplinaria', error });
    }
};

const deleteDisciplinaryActionTask = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('DisciplinaryActionTaskID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteDisciplinaryActionTask');
        
        res.status(200).json({ message: 'Tarea de acción disciplinaria eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea de acción disciplinaria', error });
    }
};

module.exports = {
    createDisciplinaryActionTask,
    getAllDisciplinaryActionTasks,
    getAllDisciplinaryActionTasksByDAID,
    updateDisciplinaryActionTask,
    deactivateDisciplinaryActionTask,
    deleteDisciplinaryActionTask
};