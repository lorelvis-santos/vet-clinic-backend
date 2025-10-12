import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import Veterinarian from "../models/veterinarian.model.js";
import HttpError from "../helpers/HttpError.js";
import generateJWT from "../helpers/generateJWT.js";

class VeterinarianController {
    // Cosas que debemos hacer:
    //  1. Verificar si el usuario no existe, si existe, devolver error
    //  2. Hashear la contraseña.
    //  3. Generar un token único.
    async signup(req, res) {
        try {
            const exists = await Veterinarian.exists({email: req.body.email});

            if (exists) {
                // 409 -> Conflict
                throw new HttpError("Email already exists", 409);
            }

            const veterinarian = new Veterinarian(req.body);

            // Insertamos el nuevo veterinario en la base de datos
            const user = await veterinarian.save();

            res.json({
                ok: true,
                id: user.id,
                message: "User registered. Email sent"
            });
        } catch (error) {
            console.log(error);

            res,status(error.statusCode || 400).json({
                ok: false,
                id: null,
                message: error.message
            });
        }
    }

    async verify(req, res) {
        try {
            const { token } = req.params;

            if (!token || token === null || token === "") {
                throw new HttpError("Invalid token", 400);
            }

            const user = await Veterinarian.findOne({token});

            if (!user) {
                throw new HttpError("User not found", 404);
            }

            user.token = null;
            user.verified = true;

            await user.save();

            res.json({
                ok: true,
                message: "User verified succesfully"
            });
        } catch (error) {
            console.log(error);

            res.status(error.statusCode || 400).json({
                ok: false,
                message: error.message
            });
        }

        res.json({ data: req.params });
    }

    async authenticate(req, res) {
        const { email, password } = req.body;
        const user = await Veterinarian.findOne({email});

        try {
            if (!user) {
                throw new HttpError("User doesn't exist", 404);
            }

            if (!user.verified) {
                throw new HttpError("User isn't verified", 403);
            }

            if (!(await user.checkPassword(password))) {
                throw new HttpError("Passwords doesn't match", 401);
            }

            res.json({
                ok: true,
                message: "User authenticated succesfully",
                token: generateJWT(user.id)
            })
        } catch (error) {
            console.log(error);

            res.status(error.statusCode || 400).json({
                ok: false,
                message: error.message
            });
        }

        res.json({ url: "From /api/veterinarians/login" });
    }

    async profile(req, res) {
        const { veterinarian } = req;

        res.json({ profile: veterinarian });
    }

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Verificar que el email exista
            const veterinarian = await Veterinarian.findOne({email});

            if (!veterinarian) {
                throw new HttpError("User doesn't exist", 404);
            }

            // Generamos un nuevo token y se lo asignamos
            const token = randomUUID();

            veterinarian.token = token;

            await veterinarian.save();

            res.json({
                ok: true,
                message: "Sent email with instructions"
            });

        } catch (error) {
            console.log(error)

            return res.status(error.statusCode || 400).json({
                ok: false,
                message: error.message
            })
        }
    }

    async checkToken(req, res) {

    }

    async changePassword(req, res) {

    }
}

export default VeterinarianController;