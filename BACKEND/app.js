import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
const PORT = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(express.json());
app.use("/user", userRouter);



mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.01eek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
).then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Connected to DB, and your server is running on ${PORT}`);
    })
})
.catch((error)=> {
        console.error("Error connecting to the database", error.message);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});