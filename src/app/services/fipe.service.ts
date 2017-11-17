import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Http } from "@angular/http";
import { VehicleBrand } from "../models/vehicle/vehicleBrand";
import { environment } from "../../environments/environment";
import { Vehicle } from "../models/vehicle/vehicle";
import { Observable } from "rxjs/Observable";
import { VehicleYear } from "../models/vehicle/vehicleYear";

@Injectable()
export class FipeService {

    client: HttpClientHelper;

    constructor(private http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getVehicleBrand(): Observable<VehicleBrand[]> {
        const url = `${environment.API_FIPE}/marcas.json`;
        return this.http.get(url)
            .map(res => res.json());
    }

    getVehicle(brandId: string): Observable<Vehicle[]> {
        const url = `${environment.API_FIPE}/veiculos/${brandId}.json`;
        return this.http.get(url)
            .map(res => res.json());
    }

    getVehicleYear(brandId: string, vehicleId: string): Observable<VehicleYear[]> {
        const url = `${environment.API_FIPE}/veiculo/${brandId}/${vehicleId}.json`;
        return this.http.get(url)
            .map(res => res.json())
    }
}