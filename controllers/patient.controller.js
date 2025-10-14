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
                message: "User registered. Email sent"
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
                message: "Patient id must be provided"
            });
        }

        const patient = await Patient.findOne({_id: id, veterinarianId: veterinarian._id});

        if (!patient) {
            res.status(404).json({
                ok: false,
                message: "Patient doesn't exist"
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
                message: "Patient id must be provided"
            });
        }

        // const patient = await Patient.findOne({_id: id, veterinarianId: veterinarian._id});

        // if (!patient) {
        //     res.status(404).json({
        //         ok: false,
        //         message: "Patient doesn't exist"
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
                message: "Patient couldn't be updated"
            });
        }
    }

    async deletePatient(req, res) {
        const { veterinarian } = req;
        const { id } = req.params;

        if (!id || !isValidObjectId(id)) {
            res.status(400).json({
                ok: false,
                message: "Patient id must be provided"
            });
        }

        const patient = await Patient.findOne({_id: id, veterinarianId: veterinarian._id});

        if (!patient) {
            res.status(404).json({
                ok: false,
                message: "Patient doesn't exist"
            });
        }

        try {
            await patient.deleteOne();
            
            res.json({
                ok: true,
                message: "Patient has been deleted succesfully"
            });
        } catch (error) {
            console.log(error);

            res.status(error.code).json({
                ok: false,
                message: "Patient couldn't be deleted"
            });
        }
    }
}

export default PatientController;