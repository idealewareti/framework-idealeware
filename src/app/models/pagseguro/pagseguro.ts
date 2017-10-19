import { PagseguroMethod } from "app/models/pagseguro/pagseguro-method";
import { PagseguroInstallment } from "app/models/pagseguro/pagseguro-installment";
import { PagseguroOption } from "app/models/pagseguro/pagseguro-option";

export class PagseguroPayment {
    session: string;
    methods: PagseguroMethod[] = [];
    methodSelected: PagseguroMethod = new PagseguroMethod();
    optionSelected: PagseguroOption = new PagseguroOption();
    installments: PagseguroInstallment[] = [];
}