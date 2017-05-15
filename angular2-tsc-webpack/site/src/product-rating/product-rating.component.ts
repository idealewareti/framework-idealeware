import { Component, OnInit, AfterContentChecked, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from "../_services/product.service";
import { Product } from "../_models/product/product";
import { ProductRating } from "../_models/productRating/product-rating";
import { ProductRatingCreate } from "../_models/productRating/product-rating-create";
import { CustomerService } from "../_services/customer.service";
import { Customer } from "../_models/customer/customer";

declare var swal: any;
//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'product-rating',
    templateUrl: '/views/product-rating.component.html',
})
export class ProductRatingComponent implements OnInit, AfterContentChecked {

    @Input() product: Product;
    @Output() ratingUpdated: EventEmitter<ProductRating> = new EventEmitter<ProductRating>();

    productsRating: ProductRating = new ProductRating();
    totalNote: number = 0;
    productsRatingCreate: ProductRatingCreate = new ProductRatingCreate();
    isLogged: boolean = false;
    loginModal: boolean = false;

    constructor(
        private service: ProductService,
        private serviceCustomer: CustomerService
    ) { }

    ngOnInit() {
        this.GetProductRating();
     }

    ngAfterContentChecked(): void {
        if(localStorage.getItem('auth'))
            this.isLogged = true;
        else this.isLogged = false;
    }
    private SumNote() {
        this.productsRating.customers.forEach(p => {
            this.totalNote += p.note;
        });
        if (this.totalNote > 0)
            this.totalNote = Math.round(this.totalNote / this.productsRating.customers.length);
    }

    GetProductRating() {
        this.service.getProductRating(this.product.id)
            .then(productsRating => {
                this.productsRating = productsRating;
                this.SumNote();
                this.ratingUpdated.emit(productsRating);
            })
            .catch(error => {
                console.log(error);
            });
    }

    createRating(event) {
        event.preventDefault();

        this.productsRatingCreate.name = this.product.name;
        this.productsRatingCreate.id = this.product.id;

        $('#btn-productsrating').button('loading');
        this.serviceCustomer.getUser()
            .then(customer => {
                this.productsRatingCreate.customers.customerId = customer.id;
                this.productsRatingCreate.customers.name = customer.firstname_Companyname;
                return this.service.createProductRating(this.productsRatingCreate)
                    .then(newsletter => {
                        swal({
                            title: 'Avaliação de Produto',
                            text: 'Produto avaliado com sucesso.',
                            type: 'success',
                            confirmButtonText: 'OK'
                        });
                        $('#avaliationModal').modal('hide');
                        this.productsRatingCreate = new ProductRatingCreate();
                    })
                    .catch(error => {
                        swal({
                            title: 'Avaliação de Produto',
                            text: 'Não foi possível salvar sua avaliação',
                            type: 'error',
                            confirmButtonText: 'OK'
                        });
                        $('#btn-productsrating').button('reset');
                        
                    });
            })
            .catch((error) => {
                console.log(error);
                $('#btn-productsrating').button('reset');
            });
    }

    addStar(event, star: number){
        event.preventDefault();
        this.productsRatingCreate.customers.note = star;
    }

    openLoginModal(event){
        if(event)
            event.preventDefault();
        this.loginModal = true;
    }

    handleModalLogin(event: boolean){
        this.loginModal = event;
    }

    handleLogin(event: Customer){
        if(event.id)
            this.isLogged = true;
    }
}