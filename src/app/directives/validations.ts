export class Validations {

    public static validCPF(cpf: string): boolean {

        if (!cpf) return null;

        cpf = cpf.replace(/\D/g, '');
        let Soma;
        let Resto;
        Soma = 0;

        if (/^(.)\1*$/.test(cpf)) return false;

        for (let i = 1; i <= 9; i++)
            Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(cpf.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++)
            Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    public static validCNPJ(cnpj: string): boolean {
        if (!cnpj) return null;

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length != 14)
            return false;

        if (/^(.)\1*$/.test(cnpj)) return false;

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += Number(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number(digitos.charAt(0)))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += Number(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number(digitos.charAt(1)))
            return false;

        return true;
    }

    public static strongPassword(password: string): boolean {
        let regex = /(?=.*\d)(?=.*[a-z]).{6,}/;

        return regex.test(password);
    }
}