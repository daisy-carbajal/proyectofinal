const { poolPromise, sql } = require("../database/db");

const createEvaluationDetail = async (req, res) => {
    try {
        const { EvaluationMasterID, ParameterID, CalificationID, CreatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationMasterID', sql.Int, EvaluationMasterID)
            .input('ParameterID', sql.Int, ParameterID)
            .input('CalificationID', sql.Int, CalificationID)
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('AddEvaluationDetail');
        
        res.status(201).json({ message: 'Detalle de evaluación agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el detalle de evaluación', error });
    }
};

const getEvaluationDetailsByEvaluationMasterID = async (req, res) => {
    try {
        const { EvaluationMasterID } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('EvaluationMasterID', sql.Int, EvaluationMasterID)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('GetEvaluationDetailsByEvaluationMasterID');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron detalles para esta evaluación' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles de la evaluación', error });
    }
};

const updateEvaluationDetail = async (req, res) => {
    try {
        const { EvaluationDetailID, ParameterID, CalificationID, UpdatedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationDetailID', sql.Int, EvaluationDetailID)
            .input('ParameterID', sql.Int, ParameterID)
            .input('CalificationID', sql.Int, CalificationID)
            .input('UpdatedBy', sql.Int, UpdatedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('UpdateEvaluationDetail');
        
        res.status(200).json({ message: 'Detalle de evaluación actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el detalle de evaluación', error });
    }
};

const deactivateEvaluationDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { DeletedBy } = req.body;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationDetailID', sql.Int, id)
            .input('DeletedBy', sql.Int, DeletedBy)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeactivateEvaluationDetail');

        res.status(200).json({ message: 'Detalle de evaluación desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el detalle de evaluación', error });
    }
};

const deleteEvaluationDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const RequesterID = req.userId;
        const pool = await poolPromise;

        await pool.request()
            .input('EvaluationDetailID', sql.Int, id)
            .input('RequesterID', sql.Int, RequesterID)
            .execute('DeleteEvaluationDetail');
        
        res.status(200).json({ message: 'Detalle de evaluación eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el detalle de evaluación', error });
    }
};

module.exports = {
    createEvaluationDetail,
    getEvaluationDetailsByEvaluationMasterID,
    updateEvaluationDetail,
    deactivateEvaluationDetail,
    deleteEvaluationDetail
};