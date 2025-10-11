import Router from "express";
import VeterinarianController from "../controllers/veterinarian.controller.js";

const router = Router();
const controller = new VeterinarianController();

router.get("/", controller.register);
router.get("/login", controller.login);
router.get("/perfil", controller.profile);

export default router;