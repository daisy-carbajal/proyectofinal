const { poolPromise, sql } = require("../database/db");

const addRolePermission = async (req, res) => {
  try {
    const { RoleID, PermissionID, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, RoleID)
      .input("PermissionID", sql.Int, PermissionID)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddRolePermission");
    res.status(201).json({ message: "Permiso asignado al rol exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al asignar permiso al rol", error });
  }
};

const getAllRolePermissions = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllRolePermissions");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron Permisos de los Roles." });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al obtener Permisos de los Roles." });
  }
};

const getRolePermissionsByRoleID = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RoleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetRolePermissionsByRoleID");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron Permisos de los Roles." });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al obtener Permisos de los Roles." });
  }
};

const deactivateRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RolePermissionID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateRolePermission");

    res
      .status(200)
      .json({ message: "Permiso de rol desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar permiso de rol", error });
  }
};

const deleteRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RolePermissionID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteRolePermission");
    res.status(200).json({ message: "Permiso de rol eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar permiso de rol", error });
  }
};

module.exports = {
  addRolePermission,
  getAllRolePermissions,
  getRolePermissionsByRoleID,
  deactivateRolePermission,
  deleteRolePermission,
};
