import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    addedMovies: [{
        type: String,
    }]
});

export default mongoose.model("Admin", adminSchema);