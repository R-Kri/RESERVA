import jwt from "jsonwebtoken";
import Movie from "../models/movies.js"

export const addMovie = async(req, res, next)=>{
    const extractedToken = req.headers.authorization?req.headers.authorization.split(" ")[1] : null; // Bearer <token>
    if(!extractedToken || extractedToken.trim() === ""){
        return res.status(404).json({message: "Invalid token"});
    }
    
    let adminId;

    //verify token
    jwt.verify(extractedToken,process.env.SECRET_KEY,(err, decrypted)=>{
        if(err){
            return res.status(400).json({message: `${err.message}`})
        }else{
            adminId = decrypted.id;
            return;
        }
    });

    // After verification e can create a new movie
    const {title, description, cast, releaseDate, posterUrl, featured} = req.body;

    // // Helper function to check if a value is empty
    // const isEmpty = (value) => {
    //     return !value || value.trim() === "";
    // };
    // const requiredFields = [title, description, releaseDate, posterUrl, featured];
    // const fieldNames = ['title', 'description', 'releaseDate', 'posterUrl', 'featured'];

    // // Check for empty fields
    // for (let i = 0; i < requiredFields.length; i++) {
    //     if (isEmpty(requiredFields[i])) {
    //         return res.status(422).json({ message: `${fieldNames[i]} is required` });
    //     }
    // }

    // Check for required fields manually
    if (!title || title.trim() === "") {
        return res.status(422).json({ message: "Title is required" });
    }
    if (!description || description.trim() === "") {
        return res.status(422).json({ message: "Description is required" });
    }
    if (!Array.isArray(cast) || cast.length === 0) {
        return res.status(422).json({ message: "At least one cast member is required" });
    }
    if (!releaseDate || releaseDate.trim() === "") {
        return res.status(422).json({ message: "Release date is required" });
    }
    if (!posterUrl || posterUrl.trim() === "") { // Validate the URL
        return res.status(422).json({ message: "Valid poster URL is required" });
    }
    if (featured === undefined || featured === null) {
        return res.status(422).json({ message: "Featured status is required" });
    }

    let movie;
    try{ 
        movie = new Movie({title, 
            description, 
            cast,
            releaseDate: new Date(`${releaseDate}`), 
            posterUrl, 
            featured, 
            admin: adminId
        });
        await movie.save();
    }catch(err){
        console.error("Error:", err);
        return res.status(500).json({ message: "Cannot add the movie" });
    }

    if(!movie){
        return res.status(500).json({ message: "Cannot add" });
    }

    return res.status(201).json({movie });
};