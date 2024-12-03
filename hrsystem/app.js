const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
require('dotenv').config();

const io = new Server(server, {
  cors: {
      origin: '*', // Cambia esto según tu configuración
      methods: ['GET', 'POST'],
  },
});

app.set('socketio', io);

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(express.json());

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('register_user', (userId) => {
    console.log(`Usuario registrado para notificaciones: ${userId}`);
    socket.join(`user_${userId}`); // Une al usuario a una sala específica
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

const routes = require("./routes");

routes.forEach((route) => {
  app.use(route.path, route.route);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal.");
});

app.use((req, res, next) => {
  res.status(404).send("Página no encontrada");
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});