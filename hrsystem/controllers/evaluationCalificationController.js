const { poolPromise, sql } = require("../database/db");

const createEvaluationCalification = async (req, res) => {
    try {
        const { Value, Description, Summary, CreatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('Value', sql.Int, Value)
            .input('Description', sql.VarChar(50), Description)
            .input('Summary', sql.VarChar(255), Summary)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddEvaluationCalification');
        
        res.status(201).json({ message: 'Calificación de evaluación agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar la calificación de evaluación', error });
    }
};

const getAllEvaluationCalifications = async (req, res) => {
    try {
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetAllEvaluationCalifications');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron calificaciones de evaluación' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las calificaciones de evaluación', error });
    }
};

const updateEvaluationCalification = async (req, res) => {
    try {
        const { EvaluationCalificationID, Value, Description, Summary } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationCalificationID', sql.Int, EvaluationCalificationID)
            .input('Value', sql.Int, Value)
            .input('Description', sql.VarChar(50), Description)
            .input('Summary', sql.VarChar(255), Summary)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateEvaluationCalification');
        
        res.status(200).json({ message: 'Calificación de evaluación actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la calificación de evaluación', error });
    }
};

const deactivateEvaluationCalification = async (req, res) => {
    try {
        const { id } = req.params;
        const { DeletedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationCalificationID', sql.Int, id)
            .input('DeletedBy', sql.Int, DeletedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateEvaluationCalification');

        res.status(200).json({ message: 'Calificación de evaluación desactivada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar la calificación de evaluación', error });
    }
};

const deleteEvaluationCalification = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationCalificationID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteEvaluationCalification');
        
        res.status(200).json({ message: 'Calificación de evaluación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la calificación de evaluación', error });
    }
};

module.exports = {
    createEvaluationCalification,
    getAllEvaluationCalifications,
    updateEvaluationCalification,
    deactivateEvaluationCalification,
    deleteEvaluationCalification
};