import User from "../models/user.js";
import bcrypt from "bcryptjs";

// Get All Users
export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No Users Found" });
    }

    return res.status(200).json({ users });
};

// Signup
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid data" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user;
    try {
        user = new User({ name, email, password: hashedPassword });
        await user.save();
    } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).json({ message: "Server error, unable to save user" });
    }

    return res.status(201).json({ user });
};

// Update User
export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

    if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid data" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user;
    try {
        user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword }, { new: true });
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Server error, unable to update user" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Updated successfully", user });
};

// Delete User
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findByIdAndDelete(id);
    } catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Server error, unable to delete user" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
};

// Login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login" });
    }

    return res.status(200).json({ message: "Login successful" });
};
