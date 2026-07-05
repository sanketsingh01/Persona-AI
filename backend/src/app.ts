import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// router imports 
import healthCheckRoutes from "./routes/healthCheck.routes.ts";
import userAuthRoutes from "./routes/auth.routes.ts";
import chatRoutes from "./routes/chat.routes.ts";
import messageRoutes from "./routes/messages.routes.ts";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
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
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);

export default app;