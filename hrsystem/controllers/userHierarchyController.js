const { poolPromise, sql } = require("../database/db");

const createUserHierarchy = async (req, res) => {
  try {
    const { UserID, ManagerID, StartDate } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("ManagerID", sql.Int, ManagerID)
      .input("StartDate", sql.DateTime, StartDate)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("AddUserHierarchy");

    res
      .status(201)
      .json({ message: "Jerarquía de usuario creada exitosamente" });
  } catch (err) {
    console.error("Error al crear jerarquía de usuario:", err);
    res.status(500).json({ message: "Error al crear jerarquía de usuario" });
  }
};

const getAllUserHierarchies = async (req, res) => {
  try {
    const pool = await poolPromise;
    const RequesterID = req.userId;

    const result = await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .execute("GetAllUserHierarchies");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron jerarquías de usuario" });
    }

    const buildHierarchy = (data) => {
      const map = new Map(); 

      data.forEach((item) => {
        map.set(item.UserID, { ...item, children: [] });
      });

      data.forEach((item) => {
        const currentNode = map.get(item.UserID);

        if (item.ManagerID) {
          const managerNode = map.get(item.ManagerID);
          if (managerNode) {
            managerNode.children.push(currentNode); // Agregar al manager como hijo
          } else {
            tree.push(currentNode);
          }
        } else {
          tree.push(currentNode);
        }
      });

      const removeDuplicates = (node) => {
        const uniqueChildren = new Map();
        node.children.forEach((child) => {
          if (!uniqueChildren.has(child.UserID)) {
            uniqueChildren.set(child.UserID, child);
          }
        });

        node.children = Array.from(uniqueChildren.values());
        node.children.forEach(removeDuplicates);
      };

      tree.forEach(removeDuplicates);

      return tree;
    };

    const hierarchy = buildHierarchy(result.recordset);

    res.status(200).json(hierarchy);
  } catch (err) {
    console.error("Error al obtener jerarquías de usuario:", err);
    res.status(500).json({ message: "Error al obtener jerarquías de usuario" });
  }
};

const updateUserHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    const { ManagerID, StartDate, EndDate } = req.body;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("HierarchyID", sql.Int, id)
      .input("ManagerID", sql.Int, ManagerID)
      .input("StartDate", sql.DateTime, StartDate)
      .input("EndDate", sql.DateTime, EndDate)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("UpdateUserHierarchy");

    res
      .status(200)
      .json({ message: "Jerarquía de usuario actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar jerarquía de usuario:", err);
    res
      .status(500)
      .json({ message: "Error al actualizar jerarquía de usuario" });
  }
};

const deactivateUserHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("HierarchyID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeactivateUserHierarchy");

    res
      .status(200)
      .json({ message: "Jerarquía de usuario desactivada exitosamente" });
  } catch (err) {
    console.error("Error al desactivar jerarquía de usuario:", err);
    res
      .status(500)
      .json({ message: "Error al desactivar jerarquía de usuario" });
  }
};

const deleteUserHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const RequesterID = req.userId;

    await pool
      .request()
      .input("HierarchyID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteUserHierarchy");

    res
      .status(200)
      .json({ message: "Jerarquía de usuario eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar jerarquía de usuario:", err);
    res.status(500).json({ message: "Error al eliminar jerarquía de usuario" });
  }
};

module.exports = {
  createUserHierarchy,
  getAllUserHierarchies,
  updateUserHierarchy,
  deactivateUserHierarchy,
  deleteUserHierarchy,
};
