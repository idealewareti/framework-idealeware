import { Component, OnInit, AfterContentChecked, Input, Output, EventEmitter, SimpleChanges, SimpleChange, PLATFORM_ID, Inject } from '@angular/core';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/product/product";
import { ProductRatingCreate } from "../../../models/product-rating/product-rating-create";
import { CustomerService } from "../../../services/customer.service";
import { Customer } from "../../../models/customer/customer";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProductRating } from '../../../models/product-rating/product-rating';
import { ProductRatingService } from '../../../services/product-rating.service';
import { Token } from '../../../models/customer/token';
import { isPlatformBrowser } from '@angular/common';

declare var swal: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-product-rating',
    templateUrl: '../../../template/product/product-rating/product-rating.html',
    styleUrls: ['../../../template/product/product-rating/product-rating.scss']
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
        private service: ProductRatingService,
        private serviceCustomer: CustomerService,
        @Inject(PLATFORM_ID) private platformId: Object

    ) {
        this.productsRatingCreate.customers.note = 5;
        this.ratingForm = formBuilder.group({
            ratingTitle: ['', Validators.required],
            ratingComment: ['', Validators.required]
        });
    }

    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token = new Token();
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['product'].currentValue != changes['product'].previousValue) {
            this.GetProductRating();
        }
    }

    ngAfterContentChecked(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (localStorage.getItem('auth'))
                this.isLogged = true;
            else this.isLogged = false;
        }
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
            .subscribe(productsRating => {
                this.productsRating = productsRating;
                this.SumNote();
                this.ratingUpdated.emit(productsRating);
            }, error => {
                console.log(error);
            });
    }

    createRating(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            if (this.ratingForm.invalid) {
                for (let i in this.ratingForm.controls) {
                    (<any>this.ratingForm.controls[i])._touched = true;
                }
                swal({
                    title: 'Falha ao enviar a avaliação',
                    text: 'Os campos informados com * são obrigatórios',
                    type: "error",
                    confirmButtonText: "OK"
                });
            }
            else {
                this.productsRatingCreate.name = this.product.name;
                this.productsRatingCreate.id = this.product.id;

                if (this.isLogged) {
                    $('#btn-productsrating').button('loading');
                    this.submitRating();
                }
                else {
                    this.openLoginModal();
                }
            }
        }
    }


    submitRating() {
        if (isPlatformBrowser(this.platformId)) {
            this.serviceCustomer.getUser(this.getToken())
                .subscribe(customer => {
                    this.productsRatingCreate.customers.customerId = customer.id;
                    this.productsRatingCreate.customers.name = customer.firstname_Companyname;
                    if (this.productsRatingCreate.customers.note == null)
                        this.productsRatingCreate.customers.note = 1;
                    return this.service.createProductRating(this.productsRatingCreate, this.getToken())
                        .subscribe(ratingResponse => {
                            swal({
                                title: 'Avaliação de Produto',
                                text: 'Produto avaliado com sucesso.',
                                type: 'success',
                                confirmButtonText: 'OK'
                            });
                            $('#btn-productsrating').button('reset');

                            this.productsRatingCreate = new ProductRatingCreate();
                            this.ratingForm.reset();
                        }, error => {
                            swal({
                                title: 'Avaliação de Produto',
                                text: 'Não foi possível salvar sua avaliação',
                                type: 'error',
                                confirmButtonText: 'OK'
                            });
                            $('#btn-productsrating').button('reset');

                        });
                }, (error) => {
                    console.log(error);
                    $('#btn-productsrating').button('reset');
                });
        }
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
        if (event.id) {
            this.isLogged = true;
            this.submitRating();
        }
    }

    hasError(key: string): boolean {
        return (this.ratingForm.controls[key].touched && this.ratingForm.controls[key].invalid);
    }
}