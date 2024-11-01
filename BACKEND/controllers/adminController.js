import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate data
    if (!email || !password || password.trim() === "" || email.trim() === "") {
        return res.status(422).json({ message: "Invalid data" });
    }

    // Check if admin already exists
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
    } catch (err) {
        console.error("Error finding admin:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

    // Hash password asynchronously
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Could not secure password" });
    }

    // Save new admin
    let admin;
    try {
        admin = new Admin({ email, password: hashedPassword });
        await admin.save();
    } catch (err) {
        console.error("Error saving admin:", err);
        return res.status(500).json({ message: "Unable to store the admin" });
    }

    return res.status(201).json({ admin });
};

export const adminLogin = async(req, res, next)=>{
    const {email, password} = req.body;
    // validate data
    if (!email || !password || password.trim() === "" || email.trim() === "") {
        return res.status(422).json({ message: "Invalid data" });
    }

    let admin;
    try{
        admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({message: "Admin not found"});
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(400).json({message: "incorrect password"})
        }
        
    }catch(err){
        console.error("Not Admin Found", err);
        return res.status(500).json({ message: "Unable to find the Admin" });
    }

    const token = jwt.sign({id: admin._id}, process.env.SECRET_KEY, {
        expiresIn: "7d",
    });

    return res.status(200).json({message:"Logged in successfully", token, id:admin._id});

}
