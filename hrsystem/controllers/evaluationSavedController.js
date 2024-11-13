const { poolPromise, sql } = require("../database/db");

const createEvaluationSaved = async (req, res) => {
    const transaction = new sql.Transaction(await poolPromise);
    try {
        const { Name, TypeID, DepartmentID, CreatedBy, ParameterWeights } = req.body;
        const RequesterID = req.userId;

        // Iniciar una transacción para asegurar atomicidad
        await transaction.begin();

        // Agregar la evaluación en la tabla EvaluationSaved
        const result = await transaction.request()
            .input('Name', sql.VarChar(255), Name)
            .input('TypeID', sql.Int, TypeID)
            .input('DepartmentID', sql.Int, DepartmentID)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddEvaluationSaved');

        // Obtener el ID de la nueva evaluación guardada
        const EvaluationSavedID = result.recordset[0].EvaluationSavedID;

        // Agregar cada parámetro de peso en la tabla EvaluationParameterWeight
        for (const weight of ParameterWeights) {
            await transaction.request()
                .input('EvaluationSavedID', sql.Int, EvaluationSavedID)
                .input('ParameterID', sql.Int, weight.ParameterID)
                .input('Weight', sql.Float, weight.Weight)
                .input('CreatedBy', sql.Int, CreatedBy)
                .input('RequesterID', sql.Int, RequesterID)
                .execute('AddEvaluationParameterWeight');
        }

        // Confirmar la transacción
        await transaction.commit();
        
        res.status(201).json({ message: 'Evaluación y parámetros de peso guardados exitosamente' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error al guardar la evaluación y los parámetros de peso', error });
    }
};

const getAllEvaluationSaved = async (req, res) => {
    try {
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetAllEvaluationSaved');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron evaluaciones guardadas' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener evaluaciones guardadas', error });
    }
};

const getEvaluationSavedFiltered = async (req, res) => {
    try {
        const { DepartmentID, TypeID } = req.query;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('DepartmentID', sql.Int, DepartmentID || null)
            .input('TypeID', sql.Int, TypeID || null)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetEvaluationSavedFiltered');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron evaluaciones con los filtros aplicados' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar las evaluaciones guardadas', error });
    }
};

const deactivateEvaluationSaved = async (req, res) => {
    try {
        const { id } = req.params;
        const { DeletedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationSavedID', sql.Int, id)
            .input('DeletedBy', sql.Int, DeletedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateEvaluationSaved');

        res.status(200).json({ message: 'Evaluación desactivada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar la evaluación', error });
    }
};

const deleteEvaluationSaved = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationSavedID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteEvaluationSaved');
        
        res.status(200).json({ message: 'Evaluación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la evaluación', error });
    }
};

module.exports = {
    createEvaluationSaved,
    getAllEvaluationSaved,
    getEvaluationSavedFiltered,
    deactivateEvaluationSaved,
    deleteEvaluationSaved
};