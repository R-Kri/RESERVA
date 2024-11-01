import express from "express";
import { addMovie } from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/", addMovie)

export default movieRouter;