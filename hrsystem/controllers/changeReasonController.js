const { poolPromise, sql } = require("../database/db");

const createChangeReason = async (req, res) => {
  try {
    const { Description, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Description", sql.VarChar(255), Description)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddChangeReason");

    res.status(201).json({ message: "Razón de cambio agregada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar la razón de cambio", error });
  }
};

const getAllChangeReasons = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllChangeReasons");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron razones de cambio" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las razones de cambio", error });
  }
};

const updateChangeReason = async (req, res) => {
  try {
    const { ChangeReasonID, Description, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ChangeReasonID", sql.Int, ChangeReasonID)
      .input("Description", sql.VarChar(255), Description)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateChangeReason");

    res
      .status(200)
      .json({ message: "Razón de cambio actualizada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la razón de cambio", error });
  }
};

const deactivateChangeReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ChangeReasonID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateChangeReason");

    res
      .status(200)
      .json({ message: "Razón de cambio desactivada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar la razón de cambio", error });
  }
};

const deleteChangeReason = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("ChangeReasonID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteChangeReason");

    res.status(200).json({ message: "Razón de cambio eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la razón de cambio", error });
  }
};

module.exports = {
  createChangeReason,
  getAllChangeReasons,
  updateChangeReason,
  deactivateChangeReason,
  deleteChangeReason,
};
