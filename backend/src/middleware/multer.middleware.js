import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory buffer

const upload = multer({ storage });

export default upload;
