import mongoose from "mongoose";

// https://mongoosejs.com/docs/schematypes.html

const veterinarianSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        trim: true
    },
    website: {
        type: String,
        default: null
    },
    token: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

const Veterinarian = mongoose.model("Veterinarian", veterinarianSchema);

export default Veterinarian;