import Veterinarian from "../models/veterinarian.model.js";

class VeterinarianController {
    // Cosas que debemos hacer:
    //  1. Verificar si el usuario no existe, si existe, devolver error
    //  2. Hashear la contraseña.
    //  3. Generar un token único.
    async signup(req, res) {
        try {
            const exists = await Veterinarian.exists({email: req.body.email});

            if (exists) {
                const error = Error("Email already exists");
                
                return res.status(400).json({
                    ok: false,
                    message: error.message,
                    id: null
                });
            }

            const veterinarian = new Veterinarian(req.body);

            // Insertamos el nuevo veterinario en la base de datos
            const user = await veterinarian.save();

            res.json({
                ok: true,
                id: user.id
            });
        } catch (error) {
            console.log(error);

            res.json({
                ok: false,
                message: error.message,
                id: null
            });
        }
    }

    async verify(req, res) {
        try {
            const { token } = req.params;

            if (!token || token === null || token === "") {
                throw new Error("Invalid token");
            }

            const user = await Veterinarian.findOne({token});

            if (!user) {
                throw new Error("User not found");
            }

            user.token = null;
            user.confirmed = true;

            await user.save();

            res.json({
                ok: true,
                message: "User verified succesfully"
            });
        } catch (error) {
            console.log(error);

            res.status(400).json({
                ok: false,
                message: error.message
            });
        }

        res.json({ data: req.params });
    }

    async authenticate(req, res) {
        res.json({ url: "From /api/veterinarians/login" });
    }

    async profile(req, res) {
        res.json({ url: "From /api/veterinarians/profile" });
    }
}

export default VeterinarianController;