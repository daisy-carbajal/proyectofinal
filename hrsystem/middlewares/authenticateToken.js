const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Cookies recibidas:", req.cookies);
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Si el token ha expirado, intenta renovarlo
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ message: "Token expirado. Necesitas iniciar sesión nuevamente." });
        }

        // Verifica y genera un nuevo token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (refreshErr, decoded) => {
          if (refreshErr) {
            return res.status(403).json({ message: "Token de actualización inválido" });
          }

          const newToken = jwt.sign({ id: decoded.id, roleId: decoded.roleId }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000, // 1 hora
          });

          req.user = decoded;
          return next();
        });
      } else {
        return res.status(403).json({ message: "Token inválido" });
      }
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = { authenticateToken };
