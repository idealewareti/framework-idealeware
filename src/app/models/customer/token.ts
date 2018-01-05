import { Customer } from "./customer";

export class Token {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    createdDate: Date = new Date();
    customer: Customer = new Customer;

    constructor() { }
}