const { poolPromise, sql } = require("../database/db");

const setPreferences = async (req, res) => {
  const { userId, enablePushNotifications, enableEmailNotifications } =
    req.body;
    const pool = await poolPromise;

  try {
    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("EnablePushNotifications", sql.Bit, enablePushNotifications)
      .input("EnableEmailNotifications", sql.Bit, enableEmailNotifications)
      .execute("SaveUserPreferences");

    res.status(200).json({ message: "Preferencias guardadas correctamente" });
  } catch (error) {
    console.error("Error al guardar preferencias:", error);
    res.status(500).json({ message: "Error al guardar preferencias" });
  }
};

const getUserPreferences = async (req, res) => {
    const { id } = req.params;
    const pool = await poolPromise;
  
    try {
      const result = await pool.request()
        .input('UserID', sql.Int, id)
        .execute('GetUserPreferences');
  
      res.status(200).json(result.recordset[0]);
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      res.status(500).json({ message: 'Error al obtener preferencias' });
    }
  };

module.exports = { setPreferences, getUserPreferences };