const { poolPromise, sql } = require("../database/db");

const addPermission = async (req, res) => {
  try {
    const { PermissionName, Description, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("PermissionName", sql.NVarChar, PermissionName)
      .input("Description", sql.NVarChar, Description)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddPermission");
    res.status(201).json({ message: "Permiso agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar permiso", error });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllPermissions");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron Permisos." });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener Permisos." });
  }
};

const deactivatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("PermissionID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivatePermission");

    res.status(200).json({ message: "Permiso desactivado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar permiso", error });
  }
};

const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("PermissionID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeletePermission");
    res.status(200).json({ message: "Permiso eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar permiso", error });
  }
};

module.exports = {
  addPermission,
  getAllPermissions,
  deactivatePermission,
  deletePermission,
};