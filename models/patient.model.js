import mongoose from "mongoose"

const patientsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    symptons: {
        type: String,
        required: true
    },
    veterinarianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinarian"
    }
}, {
    timeStamp: true
});

const Patient = mongoose.model("Patients", patientsSchema);

export default Patient;