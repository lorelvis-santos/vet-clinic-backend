import dotenv from "dotenv"
import express from "express";
import connectToDatabase from "./config/db.js";

// Rutas
import veterinarianRoutes from "./routes/veterinarian.routes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectToDatabase();

app.use("/api/veterinarians", veterinarianRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})