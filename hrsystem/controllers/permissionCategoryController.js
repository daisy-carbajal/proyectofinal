const { poolPromise, sql } = require("../database/db");

const createPermissionCategory = async (req, res) => {
  try {
    const { Name } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Name", sql.VarChar(50), Name)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddPermissionCategory");

    res
      .status(201)
      .json({ message: "Categoría de permiso agregada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar la categoría de permiso", error });
  }
};

const getAllPermissionCategory = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllPermissionCategory");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron categorías de permisos" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las categorías de permisos", error });
  }
};

const getAllPermissionsByCategory = async (req, res) => {
  try {
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllPermissionsByCategory");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron categorías de permisos" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las categorías de permisos", error });
  }
};

const getPermissionsByCategory = async (req, res) => {
  try {
    const { id } = req.params; // ID de la categoría
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("PermissionCategoryID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetPermissionsByCategory");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron permisos para esta categoría" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los permisos de la categoría",
      error,
    });
  }
};

const updatePermissionCategory = async (req, res) => {
  try {
    const { PermissionCategoryID, Name, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("PermissionCategoryID", sql.Int, PermissionCategoryID)
      .input("Name", sql.VarChar(50), Name)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdatePermissionCategory");

    res
      .status(200)
      .json({ message: "Categoría de permiso actualizada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la categoría de permiso", error });
  }
};

const deactivatePermissionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("PermissionCategoryID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivatePermissionCategory");

    res
      .status(200)
      .json({ message: "Categoría de permiso desactivada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar la categoría de permiso", error });
  }
};

const deletePermissionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("PermissionCategoryID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeletePermissionCategory");

    res
      .status(200)
      .json({ message: "Categoría de permiso eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la categoría de permiso", error });
  }
};

module.exports = {
  createPermissionCategory,
  getAllPermissionCategory,
  getAllPermissionsByCategory,
  getPermissionsByCategory,
  updatePermissionCategory,
  deactivatePermissionCategory,
  deletePermissionCategory,
};