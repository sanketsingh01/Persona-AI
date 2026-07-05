import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { ApiResponse } from "../utils/api-response.ts";
import { ApiError } from "../utils/api-error.ts";
import type { CookieOptions, Request, Response } from "express";
import { User } from "../models/user.models.ts";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

const getGoogleRedirectUri = async (req: Request, res: Response) => {
    const redirectUri = process.env.GOOGLE_CALLBACK_URI as string;
    const clientId = process.env.GOOGLE_CLIENT_ID as string;

    const uri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline`;

    res.redirect(uri);

    return;
}

const googleLogin = async (req: Request, res: Response) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json(new ApiError(400, "Code is required", ["no code provided"], ""));
    };

    try {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code as string,
                client_id: process.env.GOOGLE_CLIENT_ID as string,
                client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
                redirect_uri: process.env.GOOGLE_CALLBACK_URI as string,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            return res.status(400).json(new ApiError(400, "Failed to exchange Google auth code", [], ""));
        }

        const { id_token } = await tokenResponse.json() as { id_token?: string };

        if (!id_token) {
            return res.status(400).json(new ApiError(400, "Google token response did not include an id token", [], ""));
        }

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        const payload = await ticket.getPayload();
        const { email, name, picture } = payload as any;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const accessToken = existingUser.generateAccessToken();
            const refreshToken = existingUser.generateRefreshToken();

            return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, "Success"));
        }

        const user = await User.create({
            name: name,
            email: email,
            avatar: {
                url: picture,
            }
        });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const accessCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY) * 1000,
        };

        const refreshCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
        };

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(201).json(new ApiResponse(200, { accessToken, refreshToken }, "Success"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong during Google login";
        return res.status(500).json(new ApiError(500, message, [message], ""));
    }
};

const tokenRefresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(403).json(new ApiError(403, "Refresh token is required", [], ""));
        };

        const user = await User.findOne({
            where: {
                refreshToken,
            }
        });

        if (!user) {
            return res.status(403).json(new ApiError(403, "Refresh token is invalid", [], ""));
        };

        const decodeData = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
        );

        if (!decodeData) {
            return res.status(403).json(new ApiError(403, "Refresh token Expired. Login Again", [], ""));
        };

        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        const accessCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY) * 1000,
        };

        const refreshCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
        };

        res.cookie("accessToken", newAccessToken, accessCookieOptions);
        res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

        return res.status(200).json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Success"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong during token refresh";
        return res.status(500).json(new ApiError(500, message, [], ""));
    }
};

const getMe = async (req: Request & { user?: any }, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError(401, "Unauthorized", [], ""));
        };

        return res.status(200).json(new ApiResponse(200, { user: req.user }, "Success"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while fetching user";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, {}, "Success"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong during logout";
        return res.status(500).json(new ApiError(500, message, [], ""));
    }
}

export { getGoogleRedirectUri, googleLogin, tokenRefresh, logout, getMe };
