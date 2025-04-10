const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Token no encontrado");
    return res.status(401).json({ message: "Acceso denegado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError" && refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (refreshErr, decoded) => {
          if (refreshErr) {
            return res.status(403).json({ message: "Token de actualización inválido" });
          }
  
          const newToken = jwt.sign({ id: decoded.id, roleId: decoded.roleId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
          res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "None",
          });
  
          req.user = decoded;
          next();
        });
      } else {
        return res.status(403).json({ message: "Token inválido o expirado" });
      }
    } else {
      req.user = user;
      next();
    }
  });
  
};

module.exports = { authenticateToken };