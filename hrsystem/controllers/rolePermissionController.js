const { poolPromise, sql } = require("../database/db");

const addRolePermission = async (req, res) => {
  try {
    const { RoleID, PermissionID } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, RoleID)
      .input("PermissionID", sql.Int, PermissionID)
      .input("CreatedBy", sql.Int, RequesterID)
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

const activateRolePermission = async (req, res) => {
  try {
    const { RoleID, PermissionID, UpdatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, RoleID)
      .input("PermissionID", sql.Int, PermissionID)
      .input("UpdatedBy", sql.Int, UpdatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("ActivateRolePermission");

    res.status(200).json({ message: "Permiso de rol activado exitosamente" });
  } catch (error) {
    console.error("Error al activar permiso de rol:", error);
    res.status(500).json({ message: "Error al activar permiso de rol", error });
  }
};

const deactivateRolePermission = async (req, res) => {
  try {
    const { RoleID, PermissionID, DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, RoleID)
      .input("PermissionID", sql.Int, PermissionID)
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

const manageRolePermissions = async (req, res) => {
  try {
    const { RoleID, Permissions } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const currentPermissionsResult = await pool
      .request()
      .input("RoleID", sql.Int, RoleID)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetRolePermissionsByRoleID");

    const currentPermissions = currentPermissionsResult.recordset.map(
      (role) => role.PermissionID
    );

    const permissionsToAdd = Permissions.filter(
      (permissionId) => !currentPermissions.includes(permissionId)
    );
    const permissionsToActivate = Permissions.filter(
      (permissionId) =>
        currentPermissions.includes(permissionId) &&
        !currentPermissionsResult.recordset.find(
          (role) => role.PermissionID === permissionId
        ).IsActive
    );
    const permissionsToDeactivate = currentPermissions.filter(
      (permissionId) => !Permissions.includes(permissionId)
    );

    for (const permissionId of permissionsToAdd) {
      await pool
        .request()
        .input("RoleID", sql.Int, RoleID)
        .input("PermissionID", sql.Int, permissionId)
        .input("CreatedBy", sql.Int, RequesterID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("AddRolePermission");
    }

    for (const permissionId of permissionsToActivate) {
      await pool
        .request()
        .input("RoleID", sql.Int, RoleID)
        .input("PermissionID", sql.Int, permissionId)
        .input("UpdatedBy", sql.Int, RequesterID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("ActivateRolePermission");
    }

    for (const permissionId of permissionsToDeactivate) {
      await pool
        .request()
        .input("RoleID", sql.Int, RoleID)
        .input("PermissionID", sql.Int, permissionId)
        .input("DeletedBy", sql.Int, RequesterID)
        .input("RequesterID", sql.Int, RequesterID)
        .execute("DeactivateRolePermission");
    }

    res.status(200).json({ message: "Permisos actualizados exitosamente" });
  } catch (error) {
    console.error("Error al actualizar permisos del rol:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar permisos del rol", error });
  }
};

module.exports = {
  addRolePermission,
  getAllRolePermissions,
  getRolePermissionsByRoleID,
  deactivateRolePermission,
  deleteRolePermission,
  activateRolePermission,
  manageRolePermissions,
};
