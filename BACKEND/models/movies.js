import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    cast: [{
        type: String,
        require: true,
    }],
    releaseDate: {
        type: Date,
        require: true,
    },
    posterUrl: {
        type: String,
        require: true,
    },
    featured: {
        type: Boolean,
    },
    bookings: [{type: String}],
    admin: {
        type: String,
        required: true,
    }
})

export default mongoose.model("Movie", movieSchema);