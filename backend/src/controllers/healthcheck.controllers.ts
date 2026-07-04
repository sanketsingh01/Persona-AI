import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/api-response.ts';
import { ApiError } from '../utils/api-error.ts';

const healthCheck = async (_req: Request, res: Response) => {
    try {
        res.status(200).json(
            new ApiResponse(200, { message: "Server is running" }, "Success")
        )
    } catch (error) {
        res.status(500).json(
            new ApiError(500, "Server is not running", [error], "")
        )
    }
}

export { healthCheck };