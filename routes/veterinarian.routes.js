import Router from "express";
import VeterinarianController from "../controllers/veterinarian.controller.js";

const router = Router();
const controller = new VeterinarianController();

router.post("/", controller.signup);
router.post("/login", controller.authenticate);
router.get("/verify/:token", controller.verify);
router.get("/profile", controller.profile);

export default router;