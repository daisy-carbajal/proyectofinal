const { poolPromise, sql } = require("../database/db");

const createRole = async (req, res) => {
  try {
    const { Name, Description, CreatedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .input("CreatedBy", sql.Int, CreatedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddRole");

    res.status(201).json({ message: "Role creado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear Role" });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllRoles");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron Roles" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener Roles" });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RoleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetRoleInformationById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Role no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el Role" });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Description, LoggedUserId } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, id)
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .input("UpdatedBy", sql.Int, LoggedUserId)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateRole");

    res.status(200).json({ message: "Role actualizado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar Role" });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteRole");

    res.status(200).json({ message: "Role eliminado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar Role" });
  }
};

const deactivateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RoleID", sql.Int, id)
      .input("DeletedBy", sql.Int, DeletedBy)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateRole");

    res.status(200).json({ message: "Rol borrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al borrar Rol" });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  deactivateRole
};
