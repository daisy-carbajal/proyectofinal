const { poolPromise, sql } = require("../database/db");

const createActionPlanParameter = async (req, res) => {
    try {
        const {
            ActionPlanID,
            CurrentParameterID,
            CurrentParameterScore,
            GoalParameterID,
            GoalParameterScore,
            GoalAcquired,
            GoalStatus,
            CreatedBy
        } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanID', sql.Int, ActionPlanID)
            .input('CurrentParameterID', sql.Int, CurrentParameterID)
            .input('CurrentParameterScore', sql.Int, CurrentParameterScore)
            .input('GoalParameterID', sql.Int, GoalParameterID)
            .input('GoalParameterScore', sql.Int, GoalParameterScore)
            .input('GoalAcquired', sql.Bit, GoalAcquired)
            .input('GoalStatus', sql.VarChar(100), GoalStatus)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddActionPlanParameter');
        
        res.status(201).json({ message: 'Parámetro del plan de acción agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el parámetro del plan de acción', error });
    }
};

const getActionPlanParametersByActionPlanID = async (req, res) => {
    try {
        const { ActionPlanID } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('ActionPlanID', sql.Int, ActionPlanID)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetActionPlanParametersByActionPlanID');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron parámetros para este plan de acción' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los parámetros del plan de acción', error });
    }
};

const updateActionPlanParameter = async (req, res) => {
    try {
        const {
            ActionPlanParameterID,
            CurrentParameterID,
            CurrentParameterScore,
            GoalParameterID,
            GoalParameterScore,
            GoalAcquired,
            GoalStatus,
            UpdatedBy
        } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanParameterID', sql.Int, ActionPlanParameterID)
            .input('CurrentParameterID', sql.Int, CurrentParameterID)
            .input('CurrentParameterScore', sql.Int, CurrentParameterScore)
            .input('GoalParameterID', sql.Int, GoalParameterID)
            .input('GoalParameterScore', sql.Int, GoalParameterScore)
            .input('GoalAcquired', sql.Bit, GoalAcquired)
            .input('GoalStatus', sql.VarChar(100), GoalStatus)
            .input('UpdatedBy', sql.Int, UpdatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateActionPlanParameter');
        
        res.status(200).json({ message: 'Parámetro del plan de acción actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el parámetro del plan de acción', error });
    }
};

const deleteActionPlanParameter = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('ActionPlanParameterID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteActionPlanParameter');
        
        res.status(200).json({ message: 'Parámetro del plan de acción eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el parámetro del plan de acción', error });
    }
};

module.exports = {
    createActionPlanParameter,
    getActionPlanParametersByActionPlanID,
    updateActionPlanParameter,
    deleteActionPlanParameter
};