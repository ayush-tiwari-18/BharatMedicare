import express from "express"
import upload from "../middleware/multer.middleware.js";
import { getReport, postReport } from "../controllers/report.controller.js"
import protectRoute from "../middleware/auth.middleware.js"

const router= express.Router()

router.get("/getreport", protectRoute, getReport)
router.post("/send", upload.single("image"), postReport);

export default router;  