export class Login {
    cpfEmail: string;
    password: string;

    constructor(user, password) {
        this.cpfEmail = user;
        this.password = password;
    }
}