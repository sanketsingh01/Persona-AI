import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.models.ts";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.ts";

const isLoggedIn = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        };

        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized", [], ""));
        };

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

        if (!decodedUser) {
            return res.status(401).json(new ApiError(401, "Unauthorized", [], ""));
        };

        const user = await User.findById(decodedUser._id);

        if (!user) {
            return res.status(401).json(new ApiError(401, "User not fond via token", [], ""));
        };

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json(new ApiError(401, "Unauthorized", [], ""));
        }

        return res.status(500).json(new ApiError(500, "Error while authenticating user", [error], ""));
    }
};

export { isLoggedIn };