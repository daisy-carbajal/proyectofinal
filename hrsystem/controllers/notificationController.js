const { poolPromise, sql } = require("../database/db");

const getNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("UserID", sql.Int, id)
      .execute("GetNotifications");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las notificaciones:", err);
    res.status(500).json({ message: "Error al obtener las notificaciones" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("RequesterID", sql.Int, RequesterID)
      .input("NotificationID", sql.Int, id)
      .execute("MarkNotificationAsRead");

    res.status(200).json({ message: "Notificación marcada como leída" });
  } catch (err) {
    console.error("Error al marcar la notificación como leída:", err);
    res
      .status(500)
      .json({ message: "Error al marcar la notificación como leída" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const RequesterID = req.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input("NotificationID", sql.Int, id)
      .input("RequesterID", sql.Int, RequesterID)
      .execute("DeleteNotification");

    res.status(200).json({ message: "Notificación eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar la notificación:", err);
    res.status(500).json({ message: "Error al eliminar la notificación" });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
};
