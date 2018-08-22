import { Injectable } from "@angular/core";
import { VehicleBrand } from "../models/vehicle/vehicleBrand";
import { environment } from "../../environments/environment";
import { Vehicle } from "../models/vehicle/vehicle";
import { VehicleYear } from "../models/vehicle/vehicleYear";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FipeService {
    
    constructor(private http: Http) { }

    getVehicleBrand(): Observable<VehicleBrand[]> {
        const url = `${environment.API_FIPE}/marcas.json`;
        return this.http.get(url)
            .pipe(map(res => res.json()));
    }

    getVehicle(brandId: string): Observable<Vehicle[]> {
        const url = `${environment.API_FIPE}/veiculos/${brandId}.json`;
        return this.http.get(url)
            .pipe(map(res => res.json()));
    }

    getVehicleYear(brandId: string, vehicleId: string): Observable<VehicleYear[]> {
        const url = `${environment.API_FIPE}/veiculo/${brandId}/${vehicleId}.json`;
        return this.http.get(url)
            .pipe(map(res => res.json()));
    }
}