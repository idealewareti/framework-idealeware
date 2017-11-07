import { PagseguroMethod } from "./pagseguro-method";
import { PagseguroOption } from "./pagseguro-option";
import { PagseguroInstallment } from "./pagseguro-installment";

export class PagseguroPayment {
    session: string;
    methods: PagseguroMethod[] = [];
    methodSelected: PagseguroMethod = new PagseguroMethod();
    optionSelected: PagseguroOption = new PagseguroOption();
    installments: PagseguroInstallment[] = [];
}