import { randomUUID } from "crypto";
import Veterinarian from "../models/veterinarian.model.js";
import HttpError from "../helpers/HttpError.js";
import generateJWT from "../helpers/generateJWT.js"; 
import signUpEmail from "../emails/signUpEmail.js";
import recoveryEmail from "../emails/recoveryEmail.js";

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
                throw new HttpError("Ya existe una cuenta con ese correo", 409);
            }

            const veterinarian = new Veterinarian(req.body);

            // Insertamos el nuevo veterinario en la base de datos
            const user = await veterinarian.save();

            const result = await signUpEmail(user.name, user.email, user.token);

            res.json({
                ok: true,
                id: user.id,
                message: "Usuario registrado. Correo enviado"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code || 400).json({
                ok: false,
                id: null,
                message: error.message
            });
        }
    }

    async verify(req, res) {
        const { token } = req.params;

        try {
            if (!token || token === null || token === "") {
                throw new HttpError("Token inválido", 400);
            }

            const user = await Veterinarian.findOne({token});

            if (!user) {
                throw new HttpError("Token inválido", 404);
            }

            user.token = null;
            user.verified = true;

            await user.save();

            res.json({
                ok: true,
                message: "Usuario verificado correctamente"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code || 400).json({
                ok: false,
                message: error.message
            });
        }
    }

    async authenticate(req, res) {
        const { email, password } = req.body;
        
        try {
            const user = await Veterinarian.findOne({email});

            if (!user) {
                throw new HttpError("El usuario no existe", 404);
            }

            if (!user.verified) {
                throw new HttpError("El usuario no está verificado", 403);
            }

            if (!(await user.checkPassword(password))) {
                throw new HttpError("Contraseña incorrecta", 401);
            }

            res.json({
                ok: true,
                message: "Usuario autenticado correctamente",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    website: user.website,
                    phone: user.phone,
                    token: generateJWT(user.id)
                }
            })
        } catch (error) {
            console.log(error);

            res.status(error.code || 400).json({
                ok: false,
                message: error.message
            });
        }
    }

    async profile(req, res) {
        const { veterinarian } = req;

        res.json(veterinarian);
    }

    async updateProfile(req, res) {
        const { veterinarian } = req;
        const { profile } = req.body;

        if (!profile) {
            return res.status(400).json({
                ok: false,
                message: "El parámetro 'profile' es obligatorio" 
            })
        }

        if (veterinarian._id != profile?._id) {
            return res.status(403).json({
                ok: false,
                message: "No puedes actualizar otro usuario, solo el tuyo"
            })
        }

        if (veterinarian.email !== profile?.email && await Veterinarian.exists({ email: profile.email})) {
            return res.status(409).json({
                ok: false,
                message: "Ya existe una cuenta con ese correo"
            })
        }

        try {
            const newProfile = await Veterinarian.findByIdAndUpdate(veterinarian._id, profile, {
                new: true,
                runValidators: true
            }).select('-__v -token -password -verified');

            res.json({
                ok: true,
                profile: newProfile
            })
        } catch (error) {
            console.log(error);

            res.status(error.code).json({
                ok: false,
                message: "No se pudo actualizar el perfil del usuario"
            });
        }
    }

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Verificar que el email exista
            const veterinarian = await Veterinarian.findOne({email});

            if (!veterinarian) {
                throw new HttpError("El usuario no existe", 404);
            }

            // Generamos un nuevo token y se lo asignamos
            const token = randomUUID();

            veterinarian.token = token;

            await veterinarian.save();

            await recoveryEmail(veterinarian.name, veterinarian.email, veterinarian.token);

            res.json({
                ok: true,
                message: "Instrucciones enviadas al correo"
            });

        } catch (error) {
            console.log(error)

            return res.status(error.code || 400).json({
                ok: false,
                message: error.message
            })
        }
    }

    async checkToken(req, res) {
        const { token } = req.params;

        try {
            if (!token || token === null || token === "") {
                throw new HttpError("Token inválido", 400);
            }

            const user = await Veterinarian.findOne({token});

            if (!user) {
                throw new HttpError("Token inválido", 404);
            }

            res.json({
                ok: true,
                message: "El token es válido y el usuario existe"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code || 400).json({
                ok: false,
                message: error.message
            });
        }
    }

    async changePassword(req, res) {
        const { token } = req.params;
        const { password } = req.body;

        try {
            if (!token || token === null || token === "") {
                throw new HttpError("Token inválido", 400);
            }

            const user = await Veterinarian.findOne({token});

            if (!user) {
                throw new HttpError("Usuario no encontrado", 404);
            }

            user.token = null;
            user.password = password;

            await user.save();

            res.json({
                ok: true,
                message: "Contraseña cambiada correctamente"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code || 400).json({
                ok: false,
                message: error.message
            });
        }
    }
}

export default VeterinarianController;