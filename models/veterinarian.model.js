import mongoose from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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
        type: String,
        default: () => randomUUID()
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Añadimos un hook antes de que se guarde.
veterinarianSchema.pre("save", async function(next) {
    if (!this.isModified('password') || !this.password)
        return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

veterinarianSchema.methods.checkPassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

const Veterinarian = mongoose.model("Veterinarian", veterinarianSchema);

export default Veterinarian;