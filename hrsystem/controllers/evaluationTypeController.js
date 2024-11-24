const { poolPromise, sql } = require("../database/db");

const createEvaluationType = async (req, res) => {
    try {
        const { Name, Description, CreatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Description', sql.VarChar(50), Description)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddEvaluationType');
        
        res.status(201).json({ message: 'Tipo de evaluación agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el tipo de evaluación', error });
    }
};

const getAllEvaluationTypes = async (req, res) => {
    try {
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetAllEvaluationTypes');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tipos de evaluación' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tipos de evaluación', error });
    }
};

const updateEvaluationType = async (req, res) => {
    try {
        const { EvaluationTypeID, Name, Description } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationTypeID', sql.Int, EvaluationTypeID)
            .input('Name', sql.NVarChar, Name)
            .input('Description', sql.NVarChar, Description)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateEvaluationType');
        
        res.status(200).json({ message: 'Tipo de evaluación actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el tipo de evaluación', error });
    }
};

const deactivateEvaluationType = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationTypeID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateEvaluationType');

        res.status(200).json({ message: 'Tipo de evaluación desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el tipo de evaluación', error });
    }
};

const deleteEvaluationType = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationTypeID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteEvaluationType');
        
        res.status(200).json({ message: 'Tipo de evaluación eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tipo de evaluación', error });
    }
};

module.exports = {
    createEvaluationType,
    getAllEvaluationTypes,
    updateEvaluationType,
    deactivateEvaluationType,
    deleteEvaluationType
};