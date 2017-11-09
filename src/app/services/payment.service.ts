import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";
import { Payment } from "../models/payment/payment";
import { Token } from "../models/customer/token";
import { CreditCard } from "../models/payment/credit-card";
import { PagSeguroSimulationResponse } from "../models/pagseguro/pagseguro-simulation";
import { PagseguroCreditCard } from "../models/pagseguro/pagseguro-card";
import { MercadoPagoCreditCard } from "../models/mercadopago/mercadopago-creditcard";
import { MercadoPagoPaymentMethod } from "../models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "../models/mercadopago/mercadopago-installment-response";
import { Http } from "@angular/http";

@Injectable()
export class PaymentService {
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let payments = response.map(p => p = new Payment(p));
                resolve(payments);

            }, error => reject(error));
        });
    }

    /**
     * Retorna o Pagamento padrão da loja
     * 
     * @returns {Promise<Payment>} 
     * @memberof PaymentService
     */
    getDefault(): Promise<Payment>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/default`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let payment:Payment = new Payment(response);
                resolve(payment);

            }, error => reject(error));
        });
    }

    bankSlipTransaction(cartId: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/BankSlipTransaction/${cartId}`;
            this.client.post(url, null, token)
            .map(res => {
                if (res.status == 200) resolve(res.text());
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    creditCardTransaction(cartId, creditcard: CreditCard, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/CreditCardTransaction/${cartId}`;
            this.client.post(url, creditcard, token)
            .map(res => {
                if (res.status == 200) resolve(res.text());
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    simulateInstallments(cartId: string, token: Token): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Cart/${cartId}`;
            this.client.get(url, token)
            .map(res => res.json())
            .subscribe(response => {
                let payments = response.map(p => p = new Payment(p));
                resolve(payments);
            }, error => reject(error));
        })
    }

    simulateInstallmentsBySkuId(skuId: string): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let simulator = response.map(p => p = new Payment(p));
                resolve(simulator);
            }, error => reject(error));
        });
    }

    /**
     * Gera uma simulação do parcelamento
     * @param {string} skuId 
     * @param {string} [sessionId=null] Sessão do Pagseguro
     * @returns {Promise<Payment>} 
     * @memberof PaymentService
     */
    simulateInstallmentsBySkuIdDefault(skuId: string, sessionId: string = null): Promise<Payment>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}/Default?sessionId=${sessionId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let simulator = new Payment(response);
                resolve(simulator);
            }, error => reject(error));
        });
    }

    createPagSeguroSession(token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/Session`;
            this.client.get(url, token)
            .map(res => {
                resolve(res.text());
            })
            .subscribe(response => {

            }, error => reject(error));
        });
    }

    createPagSeguroSessionSimulator(): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/Session/Simulator`;
            this.client.get(url)
            .map(res => {
                resolve(res.text());
            })
            .subscribe(response => {

            }, error => reject(error));
        });
    }

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Promise<PagSeguroSimulationResponse>{
        return new Promise((resolve, reject) => {
            let urlProduction = `https://pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
            let urlSandbox = `https://sandbox.pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
            this.client.get(isSandBox ? urlSandbox : urlProduction)
            .map(res => res.json())
            .subscribe(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        })
    }

    PagseguroBankSlip(cartId: string, hash: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/BankSlip/${cartId}?SenderHash=${hash}`;
            this.client.post(url, null, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    PagseguroCreditCard(cartId: string, hash: string, creditCard: PagseguroCreditCard, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/CreditCard/${cartId}/?SenderHash=${hash}`;
            this.client.post(url, creditCard, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    pickUpStoreTransaction(cartId: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PickUpStore/${cartId}/`;
            this.client.post(url, null, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    delivertPayment(cartId: string, token: Token, changeFor: number = null): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/DeliveryPayment/${cartId}/`;
            changeFor = (changeFor) ? changeFor : 0;
            let body = { type: 'Money', changeFor: changeFor };
            this.client.post(url, body, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    GetMercadoPagoPublicKey(token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/PublicKey/`;
            this.client.get(url, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }


    MercadoPagoCreditCard(cartId: string, creditCard: MercadoPagoCreditCard, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/CreditCard/${cartId}`;
            this.client.post(url, creditCard, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);

            }, error => reject(error));
        });
    }   


    MercadoPagoBankSlip(cartId: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/BankSlip/${cartId}`;
            this.client.post(url, null, token)
            .map(res => {
                if (res.status == 200) {
                    resolve(res.text());
                }
                return res.json();
            })
            .subscribe(response => {
                resolve(response);

            }, error => reject(error));
        });
    }


    MercadoPagoGetPaymentsMethods(): Promise<MercadoPagoPaymentMethod[]> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/PaymentMethods`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let payments = response.map(g => g = new MercadoPagoPaymentMethod(g));
                resolve(payments);
            }, error => reject(error));
        });
    }


    MercadoPagoGetInstalments(payment_method_id:string, amount:number ): Promise<MercadoPagoInstallmentResponse> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/Installments/${payment_method_id}/${amount}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new MercadoPagoInstallmentResponse(response));
            }, error => reject(error));
        });
    }
}