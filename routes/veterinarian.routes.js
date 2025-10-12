import Router from "express";
import VeterinarianController from "../controllers/veterinarian.controller.js";
import requireAuth from "../middlewares/require-auth.middleware.js";

const router = Router();
const controller = new VeterinarianController();

// Parte pública
router.post("/", controller.signup);
router.post("/login", controller.authenticate);
router.get("/verify/:token", controller.verify);
router.post("/forgot-password", controller.forgotPassword);

// Parte privada
router.get("/profile", requireAuth, controller.profile);

export default router;