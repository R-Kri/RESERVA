import User from "../models/user.js"
import bcrypt from "bcryptjs";
export const getAllUsers = async (req, res, next)=>{
    let users;
    try{ 
        users = await User.find();
    }catch(err){
        return console.log(err);
        ;
    }

    if(!users || users.length === 0){
        return res.status(404).json({message: "No Users Found"});
    }

    return res.status(200).json({users});
};

export const signup = async(req, res, next) => {
    const {name, email, password} = req.body;
    if (!name || name.trim() === "" ||
        !email || email.trim() === "" ||
        !password || password.trim() === "") {
            return res.status(422).json({ message: "Invalid data" });
        }
    const hashedPassword = bcrypt.hashSync(password, 12);

    let user;
    try{ 
        user = new User({name, email, password: hashedPassword});
        user = await user.save();
    }catch(err){
        return console.log(err);
    }

    if(!user){
        return res.status(404).json({message: "No Users Found"});
    }

    return res.status(201).json({user})
};

// export const updateUserDetails = async(req, res, next)=>{
//     const {email, password, newName, newPassword} = req.body;
//     let user;

//     try{
//         // to find user email
//         user = await User.FindOne({email});
//         if(!user){
//             return res.status(404).json({message: "No user found"});
//         }  

//         // check if password matches
//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch){
//             return res.status(401).json({message: "Wrong Password"})
//         }

//         // update user credentials
//         user.name = newName || user.name;
//         if(newPassword){
//             user.password = await bcrypt.hash(newPassword, 12);
//         }

//         // save the updated user
//         await user.save();

//         return res.status(200).json({message: "User details successfully updated"})
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({message: "Server Error"});
//     }
// }

export const updateUser = async (req, res, next)=>{
    const id = req.params.id;
    const { name, email, password } = req.body;

    if (!name || name.trim() === "" ||
        !email || email.trim() === "" ||
        !password || password.trim() === "") {
            return res.status(422).json({ message: "Invalid data" });
        }
    const hashedPassword = bcrypt.hashSync(password, 12);

    let user;
    try{ 
        user = await User.findByIdAndUpdate(id, {
            name, email,
            password:hashedPassword,
        });
    }catch(err){
        return console.log(err);
    }

    if(!user){
        return res.status(500).json({message: "Something went wrong"});
    }
    res.status(200).json({message: "Updated successfully"});
}

export const deleteUser = async (req, res, next) =>{
    const id = req.params.id;
    let user;
    try{ 
        user = await User.findByIdAndDelete(id);
    }catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(400).json({message: "Something went wrong"});
    }
    return res.status(200).json({message: "User was deleted successfully"});
}

export const login = async (req, res, next)=>{
    const {email, password} = req.body;
    let existingUser;
    try{ 
        existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({message: "No User Found"});
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(401).json({message: "Password is incorrect"});
        }
    }catch(err){
        return console.log(err);
    }

    return res.status(200).json({message: "login Successful"});
}