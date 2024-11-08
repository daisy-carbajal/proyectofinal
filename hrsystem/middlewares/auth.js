const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado, se requiere un token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token no válido" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: verified.id,
      roleId: verified.roleId
    };
    
    next();
  } catch (err) {
    res.status(400).json({ message: "Token no válido" });
  }
};

module.exports = verifyToken;