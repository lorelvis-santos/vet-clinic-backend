import { isValidObjectId } from "mongoose";
import Patient from "../models/patient.model.js";
import HttpError from "../helpers/HttpError.js";

class PatientController {
    async getPatients(req, res) {
        const { veterinarian } = req;

        // Buscamos sus pacientes
        const patients = await Patient.find({veterinarianId: veterinarian._id});

        res.json({
            ok: true,
            patients
        });
    }

    async addPatient(req, res) {
        const patient = new Patient(req.body);

        patient.veterinarianId = req.veterinarian._id;

        try {
            patient.save();

            res.json({
                ok: true,
                patient: patient,
                message: "Paciente guardado"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code).json({
                ok: false,
                id: null,
                message: error.message
            });
        }
    }

    async getPatient(req, res) {
        const { veterinarian } = req;
        const { id } = req.params;

        if (!id || !isValidObjectId(id)) {
            res.status(400).json({
                ok: false,
                message: "La id del paciente es requerida"
            });
        }

        const patient = await Patient.findOne({_id: id, veterinarianId: veterinarian._id});

        if (!patient) {
            res.status(404).json({
                ok: false,
                message: "El paciente no existe"
            });
        }

        res.json({
            ok: true,
            patient
        });
    }

    async updatePatient(req, res) {
        const { veterinarian } = req;
        const { id } = req.params;

        if (!id || !isValidObjectId(id)) {
            res.status(400).json({
                ok: false,
                message: "La id del paciente es requerida"
            });
        }

        // const patient = await Patient.findOne({_id: id, veterinarianId: veterinarian._id});

        // if (!patient) {
        //     res.status(404).json({
        //         ok: false,
        //         message: "El paciente no existe"
        //     });
        // }

        // Método del profesor, más util si hay que hacer validaciones o algunos cambios manuales.
        // patient.name = req.body.name || patient.name;
        // patient.owner = req.body.owner || patient.owner;
        // patient.email = req.body.email || patient.email;
        // patient.date = req.body.date || patient.date;
        // patient.symptoms = req.body.symptoms || patient.symptoms;

        // const updatedPatient = await patient.save();
        
        // Otro método sugerido por ChatGPT.
        // const fields = ['name', 'owner', 'email', 'date', 'symptoms'];

        // fields.forEach(field => {
        //     patient[field] = req.body[field] ?? patient[field];
        // });

        // Método más profesional sugerido por ChatGPT. Útil cuando solo quieres actualizar.
        try {
            const newPatient = await Patient.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            res.json({
                ok: true,
                patient: newPatient
            })
        } catch (error) {
            console.log(error);

            res.status(error.code).json({
                ok: false,
                message: "No se pudo actualizar el paciente"
            });
        }
    }

    async deletePatient(req, res) {
        const { veterinarian } = req;
        const { id } = req.params;

        if (!id || !isValidObjectId(id)) {
            res.status(400).json({
                ok: false,
                message: "La id del paciente es requerida"
            });
        }

        const patient = await Patient.findOne({_id: id, veterinarianId: veterinarian._id});

        if (!patient) {
            res.status(404).json({
                ok: false,
                message: "El paciente no existe"
            });
        }

        try {
            await patient.deleteOne();
            
            res.json({
                ok: true,
                message: "Paciente eliminado correctamente"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code).json({
                ok: false,
                message: "No se pudo eliminar el paciente"
            });
        }
    }
}

export default PatientController;