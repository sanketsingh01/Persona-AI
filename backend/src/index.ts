import app from "./app";
import dotenv from "dotenv";
import connectDB from "./db";
import type { Request, Response } from "express";

dotenv.config({
    path: './.env'
});


const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        })
    })
    .catch((err) => {
        console.error("MONGODB connection error: ", err);
        process.exit(1);
    })