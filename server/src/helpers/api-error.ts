export class ApiError extends Error {
    statusCode: number;
    constructor(message: any, statusCode: any) {
        super(message);
        this.statusCode = statusCode;
    }
}