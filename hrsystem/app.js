require("./instrument");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const Sentry = require("@sentry/node");
const logger = require("./logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.set("socketio", io);

io.on("connection", (socket) => {
  logger.info(`Usuario conectado: ${socket.id}`);

  socket.on("register_user", (userId) => {
    logger.info(`Usuario registrado para notificaciones: ${userId}`);
    socket.join(`user_${userId}`);
  });

  socket.on("disconnect", () => {
    logger.warn(`Usuario desconectado: ${socket.id}`);
  });

  socket.on("error", (err) => {
    logger.error(`Error en WebSocket: ${err.message}`);
    Sentry.captureException(err);
  });
});

// 🔹 Importar rutas (asegúrate de que `routes` está bien definido)
const routes = require("./routes");

routes.forEach((route) => {
  app.use(route.path, route.route);
});

Sentry.setupExpressErrorHandler(app);

// 🔹 Middleware de errores personalizados
app.use((err, req, res, next) => {
  logger.error(`Error en la API: ${err.message}`);
  Sentry.captureException(err);
  res.status(500).json({ error: "Algo salió mal." });
});

// 🔹 Manejo de errores 404
app.use((req, res, next) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).send("Página no encontrada");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
