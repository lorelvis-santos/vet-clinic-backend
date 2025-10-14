import dotenv from "dotenv"
import express from "express";
import connectToDatabase from "./config/db.js";

// Rutas
import veterinarianRoutes from "./routes/veterinarian.routes.js"
import patientRoutes from "./routes/patient.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 4000;

connectToDatabase();

app.use("/api/veterinarians", veterinarianRoutes);
app.use("/api/patients", patientRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})