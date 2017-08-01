import { Component, OnInit, AfterContentChecked, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { ProductService } from "app/services/product.service";
import { Product } from "app/models/product/product";
import { ProductRating } from "app/models/product-rating/product-rating";
import { ProductRatingCreate } from "app/models/product-rating/product-rating-create";
import { CustomerService } from "app/services/customer.service";
import { Customer } from "app/models/customer/customer";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

declare var swal: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'product-rating',
    templateUrl: '../../views/product-rating.component.html',
})
export class ProductRatingComponent implements AfterContentChecked {
    ratingForm: FormGroup;
    @Input() product: Product;
    @Output() ratingUpdated: EventEmitter<ProductRating> = new EventEmitter<ProductRating>();

    productsRating: ProductRating = new ProductRating();
    totalNote: number = 0;
    productsRatingCreate: ProductRatingCreate = new ProductRatingCreate();
    isLogged: boolean = false;
    loginModal: boolean = false;

    constructor(
        formBuilder: FormBuilder,
        private service: ProductService,
        private serviceCustomer: CustomerService
    ) {
        this.productsRatingCreate.customers.note = 5;
        this.ratingForm = formBuilder.group({
            ratingTitle: ['', Validators.required],
            ratingComment: ['', Validators.required]
        });
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['product'].currentValue != changes['product'].previousValue) {
            this.GetProductRating();
        }
    }

    ngAfterContentChecked(): void {
        if (localStorage.getItem('auth'))
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

        if (this.ratingForm.invalid) {
            for (let i in this.ratingForm.controls) {
                (<any>this.ratingForm.controls[i])._touched = true;
            }
        }
        else {
            this.productsRatingCreate.name = this.product.name;
            this.productsRatingCreate.id = this.product.id;

            $('#btn-productsrating').button('loading');

            if(this.isLogged){
                this.submitRating();
            }
            else{
                this.openLoginModal();
            }


        }
    }


    submitRating(){
        this.serviceCustomer.getUser()
        .then(customer => {
            this.productsRatingCreate.customers.customerId = customer.id;
            this.productsRatingCreate.customers.name = customer.firstname_Companyname;
            if (this.productsRatingCreate.customers.note == null)
                this.productsRatingCreate.customers.note = 1;
            return this.service.createProductRating(this.productsRatingCreate)
                .then(ratingResponse => {
                    swal({
                        title: 'Avaliação de Produto',
                        text: 'Produto avaliado com sucesso.',
                        type: 'success',
                        confirmButtonText: 'OK'
                    });
                    $('#btn-productsrating').button('reset');

                    this.productsRatingCreate = new ProductRatingCreate();
                    this.ratingForm.reset();
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

    addStar(event, star: number) {
        event.preventDefault();
        this.productsRatingCreate.customers.note = star;
    }

    openLoginModal(event = null) {
        if (event)
            event.preventDefault();
        this.loginModal = true;
    }

    handleModalLogin(event: boolean) {
        this.loginModal = event;
    }

    handleLogin(event: Customer) {
        if (event.id){
            this.isLogged = true;
            this.submitRating();
        }
    }

    hasError(key: string): boolean {
        return (this.ratingForm.controls[key].touched && this.ratingForm.controls[key].invalid);
    }
}