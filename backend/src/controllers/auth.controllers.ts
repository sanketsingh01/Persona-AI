import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { ApiResponse } from "../utils/api-response.ts";
import { ApiError } from "../utils/api-error.ts";
import type { CookieOptions, Request, Response } from "express";
import { User } from "../models/user.models.ts";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

const accessCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 1000, //1d
};

const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 15 * 1000, //15m
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

const saveRefreshToken = async (userId: string, refreshToken: string) => {
    await User.findByIdAndUpdate(userId, { refreshToken });
};

const redirectAfterLogin = (res: Response) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontendUrl}/dashboard`);
};

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
        const { email, name, picture } = payload as { email: string; name: string; picture: string };

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: {
                    url: picture,
                },
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        await saveRefreshToken(user._id.toString(), refreshToken);
        setAuthCookies(res, accessToken, refreshToken);

        return redirectAfterLogin(res);
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

        const user = await User.findOne({ refreshToken });

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

        await saveRefreshToken(user._id.toString(), newRefreshToken);
        setAuthCookies(res, newAccessToken, newRefreshToken);

        return res.status(200).json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Success"));
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json(new ApiError(403, "Refresh token Expired. Login Again", [], ""));
        }

        const message = error instanceof Error ? error.message : "Something went wrong during token refresh";
        return res.status(500).json(new ApiError(500, message, [], ""));
    }
};

const getMe = async (req: Request & { user?: any }, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError(401, "Unauthorized", [], ""));
        };

        const user = req.user.toObject();
        delete user.accessToken;
        delete user.refreshToken;

        return res.status(200).json(new ApiResponse(200, { user }, "Success"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while fetching user";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
}

const logout = async (req: Request & { user?: any }, res: Response) => {
    try {
        if (req.user?._id) {
            await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, {}, "Success"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong during logout";
        return res.status(500).json(new ApiError(500, message, [], ""));
    }
}

export { getGoogleRedirectUri, googleLogin, tokenRefresh, logout, getMe };
