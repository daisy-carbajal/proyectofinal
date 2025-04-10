const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "C:/Users/daisy/Desktop/proyectofinal/hrsystem/config/google-cloud-key.json" });
const bucket = storage.bucket("hrsystem");

const upload = multer({
    storage: multer.memoryStorage(),
});

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const fileName = `users/${req.params.userId}/${Date.now()}_${req.file.originalname}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false
        });

        blobStream.on("error", (err) => {
            console.error("Error en la subida del archivo:", err);
            res.status(500).json({ message: "Error subiendo el archivo", error: err.message });
        });

        blobStream.on("finish", async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            res.status(200).json({ message: "File uploaded successfully", url: publicUrl, name: fileName });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const listFiles = async (req, res) => {
    try {
        const [files] = await bucket.getFiles({ prefix: `users/${req.params.userId}/` });

        const fileList = files.map(file => ({
            name: file.name.replace(`users/${req.params.userId}/`, ""),
            url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
        }));

        res.status(200).json(fileList);
    } catch (error) {
        console.error("Error listing files:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        const fileName = `users/${req.params.userId}/${req.params.fileName}`;
        const file = bucket.file(fileName);
        await file.delete();

        res.status(200).json({ message: "File deleted successfully." });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const uploadMiddleware = upload.single("file");

const generateSignedUrl = async (req, res) => {
    try {
        const fileName = `users/${req.params.userId}/${req.params.fileName}`;
        const file = bucket.file(fileName);

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000
        });

        res.status(200).json({ url });
    } catch (error) {
        console.error("Error generando URL firmada:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadMiddleware,
    listFiles,
    deleteFile,
    generateSignedUrl
};