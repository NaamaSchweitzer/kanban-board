import { Router } from "express";
import { resetDB } from "../controllers/dev.js";

const router = Router();

router.post("/reset", resetDB);

export default router;
