import { HttpClient } from '../helpers/httpclient';
import { Injectable } from "@angular/core";
import { AppSettings } from "app/app.settings";
import { VehicleBrand } from "../models/vehicle/vehicleBrand";
import { Vehicle } from "../models/vehicle/vehicle";
import { VehicleYear } from "../models/vehicle/vehicleYear";

@Injectable()
export class FipeService {

    constructor(private client: HttpClient) {

    }

    setUp() {
        if (AppSettings.DOMAIN != localStorage.getItem('store_domain'))
            localStorage.clear();

        localStorage.setItem('store_domain', AppSettings.DOMAIN);
    }

    getVehicleBrand(): Promise<VehicleBrand[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_FIPE}/marcas.json`;

            this.client.getFipe(url)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(response.map(c => c = new VehicleBrand(c)));
                }, error => reject(error));
        });
    }

    getVehicle(brandId: string): Promise<Vehicle[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_FIPE}/veiculos/${brandId}.json`;

            this.client.getFipe(url)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(response.map(c => c = new Vehicle(c)));
                }, error => reject(error));
        });
    }

     getVehicleYear(brandId: string, vehicleId: string): Promise<VehicleYear[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_FIPE}/veiculo/${brandId}/${vehicleId}.json`;

            this.client.getFipe(url)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(response.map(c => c = new VehicleYear(c)));
                }, error => reject(error));
        });
    }
}