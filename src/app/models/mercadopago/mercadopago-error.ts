export class MercadoPagoError {
    code: string;
    message: string;
    statusCode: number;

    constructor(code: string, message: string, statusCode: number = null) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}