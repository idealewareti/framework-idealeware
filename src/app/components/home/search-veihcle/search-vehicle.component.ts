import { Component, PLATFORM_ID, Inject } from "@angular/core";
import { Vehicle } from "../../../models/vehicle/vehicle";
import { VehicleBrand } from "../../../models/vehicle/vehicleBrand";
import { VehicleYear } from "../../../models/vehicle/vehicleYear";
import { FipeService } from "../../../services/fipe.service";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { AppCore } from "../../../app.core";
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-search-vehicle',
    templateUrl: '../../../template/home/search-vehicle/search-vehicle.html',
    styleUrls: ['../../../template/home/search-vehicle/search-vehicle.scss']
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
        @Inject(PLATFORM_ID) private platformId: Object,
        private service: FipeService,
        private parentRouter: Router
    ) { }

    ngOnInit() {
        this.initVehicleBrand();
    }

    initVehicleBrand() {
        this.service.getVehicleBrand()
            .subscribe(Vehicle => {
                this.vehiclesBrand = Vehicle;
            }), (error => console.log(error));
    }

    getVehicle(event) {
        event.preventDefault();
        this.service.getVehicle(this.brandId)
            .subscribe(Vehicle => {
                this.vehiclesYear = [];
                this.vehicles = Vehicle;
            }), (error => console.log(error));
    }

    getVehicleYear(event) {
        event.preventDefault();
        this.service.getVehicleYear(this.brandId, this.vehicleId)
            .subscribe(Vehicles => {
                this.vehiclesYear = [];
                Vehicles.forEach(Vehicle => {
                    Vehicle.name = Vehicle.name.substring(0, 4);
                    if (this.vehiclesYear.findIndex(c => c.name == Vehicle.name) == -1 && !/[^\d.-]/.test(Vehicle.name)) {
                        this.vehiclesYear.push(Vehicle);
                    }
                });
            }), (error => console.log(error));
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
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}