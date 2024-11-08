const { poolPromise, sql } = require("../database/db");

const createDepartment = async (req, res) => {
  try {
    const { Name } = req.body;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddDepartment");

    res.status(201).json({ message: "Departmento creado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear Departmento." });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool.request()
    .input("RequesterID", sql.Int, RequesterID)
    .execute("GetAllDepartments");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron Departments" });
    }

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener Departments" });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("DepartmentID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetDepartmentById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Departmento no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el Department" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("DepartmentID", sql.Int, id)
      .input("Name", sql.NVarChar, Name)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateDepartment");

    res.status(200).json({ message: "Department actualizado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar Department" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("DepartmentID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteDepartment");

    res.status(200).json({ message: "Department eliminado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar Department" });
  }
};

const deactivateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("DepartmentID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateDepartment");

    res.json({ message: "Departamento borrado exitosamente." });
  } catch (err) {
    res.status(500).send("Error al borrar el departmento.");
    console.error(err);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  deactivateDepartment,
};
