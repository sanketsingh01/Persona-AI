class ApiError extends Error {
    statusCode: number;
    errors: unknown[];
    success: boolean;

    constructor(
        statusCode: number,
        messsage: string,
        errors: unknown[] = [],
        stack: ""
    ) {
        super(messsage);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };