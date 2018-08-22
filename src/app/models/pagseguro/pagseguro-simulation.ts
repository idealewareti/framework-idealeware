import { PagSeguroSimulationBrands } from "./pagseguro.simulation-brands";

export class PagSeguroSimulationResponse {
    error: boolean;
    installments: PagSeguroSimulationBrands;
}