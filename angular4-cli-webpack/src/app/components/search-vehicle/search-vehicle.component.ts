import { Component } from "@angular/core";
import { Vehicle } from "app/models/vehicle/vehicle";
import { VehicleBrand } from "app/models/vehicle/vehicleBrand";
import { VehicleYear } from "app/models/vehicle/vehicleYear";
import { FipeService } from "app/services/fipe.service";
import { AppSettings } from "app/app.settings";
import { Router } from "@angular/router";
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'search-vehicle',
    templateUrl: '../../views/search-vehicle.component.html'
})
export class SearchVehicleComponent {
    vehicles: Vehicle[] = [];
    vehiclesBrand: VehicleBrand[] = [];
    vehiclesYear: VehicleYear[] = [];
    brandId: string = null;
    vehicleId: string = null;
    vehicleYear: string = null;
    q: string = null;

    // @Input()
    constructor(
        private service: FipeService,
        private parentRouter: Router
    ) { }

    ngOnInit() {
        this.initVehicleBrand();
    }

    initVehicleBrand() {
        this.service.getVehicleBrand()
            .then(Vehicle => {
                this.vehiclesBrand = Vehicle;
            })
            .catch(error => console.log(error));
    }

    getVehicle(event) {
        event.preventDefault();
        this.service.getVehicle(this.brandId)
            .then(Vehicle => {
                this.vehiclesYear = [];
                this.vehicles = Vehicle;
            })
            .catch(error => console.log(error));
    }

    getVehicleYear(event) {
        event.preventDefault();
        this.service.getVehicleYear(this.brandId, this.vehicleId)
            .then(Vehicles => {
                this.vehiclesYear = [];
                Vehicles.forEach(Vehicle => {
                    Vehicle.name = Vehicle.name.substring(0, 4);
                    if (this.vehiclesYear.findIndex(c => c.name == Vehicle.name) == -1 && !/[^\d.-]/.test(Vehicle.name)) {
                        this.vehiclesYear.push(Vehicle);
                    }
                });
            })
            .catch(error => console.log(error));
    }

    searchFor(event) {
        event.preventDefault();
        $('#search-box #form-searchVehicle').css('top', '-100%');
        $('#search-box .mask').fadeOut(300, function () {
            $('#search-box').hide();
        });
        let search = "";
        if (this.q)
            search = this.q
        if (this.brandId)
            search += search ? '%' + this.vehiclesBrand.find(b => b.id.toString() == this.brandId.toString()).fipe_name : this.vehiclesBrand.find(b => b.id.toString() == this.brandId.toString()).fipe_name
        if (this.vehicleId)
            search += search ? '%' + this.vehicles.find(v => v.id.toString() == this.vehicleId).fipe_name : this.vehicles.find(v => v.id.toString() == this.vehicleId).fipe_name
        if (this.vehicleYear)
            search += search ? '%' + this.vehicleYear : this.vehicleYear

        if (search)
            this.parentRouter.navigate(['/buscar', { 'q': search }]);

    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }


}