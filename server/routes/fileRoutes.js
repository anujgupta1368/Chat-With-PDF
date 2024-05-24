const { Router } = require("express");
const multer = require("multer");
const { uploadFileHandler, getAllProjects } = require("../controllers/fileController");
const router = Router();
const upload = multer();
router.post("/uploadFile", upload.single("file"), uploadFileHandler);
router.get("/getProjects", getAllProjects);

module.exports = router;