import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// router imports 
import healthCheckRoutes from "./routes/healthCheck.routes.ts";
import userAuthRoutes from "./routes/auth.routes.ts"

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/auth", userAuthRoutes);

export default app;