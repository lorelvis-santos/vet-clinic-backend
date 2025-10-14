import Router from "express";
import PatientController from "../controllers/patient.controller.js";
import requireAuth from "../middlewares/require-auth.middleware.js";

const router = Router();
const controller = new PatientController();

// Rutas aquí
router
    .route("/")
    .get(requireAuth, controller.getPatients)
    .post(requireAuth, controller.addPatient);

router.route("/:id")
    .get(requireAuth, controller.getPatient)
    .put(requireAuth, controller.updatePatient)
    .delete(requireAuth, controller.deletePatient);

export default router;