const { poolPromise, sql } = require("../database/db");

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const roleId = req.headers["x-role-id"];

    if (!userId || !roleId) {
      return res
        .status(400)
        .json({ message: "Faltan encabezados de userId o roleId" });
    }

    try {
      const pool = await poolPromise;

      const permissionResult = await pool
        .request()
        .input("PermissionName", sql.NVarChar, permissionName)
        .execute("GetPermissionID");

      if (permissionResult.recordset.length === 0) {
        return res.status(404).json({ message: "Permiso no Encontrado." });
      }

      const permissionId = permissionResult.recordset[0].PermissionID;

      const rolePermissionResult = await pool
        .request()
        .input("RoleID", sql.Int, roleId)
        .input("PermissionID", sql.Int, permissionId)
        .execute("CheckRolePermission");

      if (rolePermissionResult.recordset.length === 0) {
        return res.status(403).json({
          message:
            "Acceso denegado: No tienes permiso para realizar esta acción.",
        });
      }

      req.userId = userId;

      next();
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred during permission verification" });
    }
  };
};

module.exports = { checkPermission };
