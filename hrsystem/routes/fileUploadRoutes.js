const express = require("express");
const fileUploadController = require("../controllers/fileUploadController");

const router = express.Router();

// Ruta para subir archivos
router.post("/:userId/upload", fileUploadController.uploadMiddleware, fileUploadController.uploadFile);

// Ruta para listar archivos
router.get("/:userId/files", fileUploadController.listFiles);

// Ruta para eliminar archivos
router.delete("/:userId/files/:fileName", fileUploadController.deleteFile);

router.get("/:userId/files/:fileName/signedUrl", fileUploadController.generateSignedUrl);

module.exports = router;