import dotenv from "dotenv"
import express from "express";
import connectToDatabase from "./config/db.js";
import cors from "cors";

// Rutas
import veterinarianRoutes from "./routes/veterinarian.routes.js"
import patientRoutes from "./routes/patient.routes.js";
import HttpError from "./helpers/HttpError.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 4000;

connectToDatabase();

const allowedDomains = new Set([
    process.env.FRONTEND_URL,
]);

const corsOptions = {
    origin: function(origin, callback) {
        // Verifica que el dominio exista dentro de los dominios permitidos
        if (allowedDomains.has(origin)) {
            callback(null, true);
        } else {
            callback(new HttpError("Invalid origin", 403))
        }
    }
}

app.use(cors(corsOptions));
app.use("/api/veterinarians", veterinarianRoutes);
app.use("/api/patients", patientRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})