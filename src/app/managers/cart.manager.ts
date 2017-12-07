import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cart/cart-item';
import { Cart } from '../models/cart/cart';
import { Product } from '../models/product/product';
import { Sku } from '../models/product/sku';
import { Shipping } from "../models/shipping/shipping";
import { Service } from "../models/product-service/product-service";
import { CustomPaintCombination } from "../models/custom-paint/custom-paint-combination";
import { Token } from '../models/customer/token';
import { isPlatformBrowser } from '@angular/common';
import { Paint } from '../models/custom-paint/custom-paint';
import { AppCore } from '../app.core';

declare var toastr: any;

@Injectable()
export class CartManager {
    private cart: Cart;
    private serviceProduct: Service[] = [];

    constructor(private service: CartService, @Inject(PLATFORM_ID) private platformId: Object) { }

    /**
     * Retorna o Bearer Token baseado no token armazenado no localStorage
     * @private
     * @returns {Token} 
     * @memberof CartManager
     */
    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    /**
     * Retorna o CEP armazenado no localStorage
     * @private
     * @returns {number} 
     * @memberof CartManager
     */
    private getZipcode(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (localStorage.getItem('customer_zipcode'))
                return Number(localStorage.getItem('customer_zipcode').replace('-', ''));
            return 0;
        }
        return 0;
    }

    /**
     * Retorna o ID da Session armazenado no localStorage
     * @private
     * @returns {string} 
     * @memberof CartManager
     */
    private getSessionId(): string {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('session_id');
        }
        return null;
    }

    /**
     * Salva o ID do carrinho na localStorage
     * @param {string} id 
     * @memberof CartManager
     */
    setCartId(id: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cart_id', id);
        }
    }

    /**
     * Retorna o ID do carrinho armazenado no localStorage
     * @returns {string} 
     * @memberof CartManager
     */
    getCartId(): string {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('cart_id');
        }
        return null;
    }

    /**
     * Retorna o carrinho pela API
     * 
     * @param {string} cartId ID do carrinho
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    getCart(cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (!cartId) {
                console.log('Carrinho não encontrado');
                resolve(new Cart());
            }
            else {
                this.service.getCart(cartId)
                    .subscribe(cart => {
                        resolve(cart);
                    }, error => {
                        reject(error);
                    });
            }
        });
    }

    /**
     * Adiciona um produto ao carrinho
     * Se não houver um carrinho existente, um novo será criado
     * 
     * @param {string} cartId ID do carrinho
     * @param {Product} product Produto à ser a adicionado ao carrinho
     * @param {Sku} sku SKU selecionado
     * @param {number} quantity Quantidade de produtos
     * @param {string} feature Detalhes adicionais (opcional)
     * @returns {Promise<Cart>} Carrinho com produto
     * @memberof CartManager
     */
    purchase(cartId: string, product: Product, sku: Sku, quantity: number, feature: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (cartId) {
                console.log('Cart exists');
                this.getCart(cartId)
                    .then(cart => {
                        console.log('Adding item to cart');
                        return this.addItem(cartId, sku.id, quantity, feature);
                    })
                    .then(cart => {
                        console.log('Item added to cart');
                        resolve(cart);
                    })
                    .catch(error => reject(error));
            }
            else {
                console.log(`Cart doen't exists`);
                let cart = new Cart();
                let cartItem = new CartItem().createFromProduct(product, sku, feature, quantity);
                cart.products.push(cartItem);
                console.log('Creating new cart');
                this.createCart(cart)
                    .then(response => {
                        console.log('Cart successful created');
                        resolve(response);
                    })
                    .catch(error => reject(error));
            }
        });
    }

    /**
     * Adciona uma tinta ao carrinho
     * Se não houver um carrinho existente, um novo será criado
     * 
     * @param {string} cartId ID do carrinho
     * @param {CustomPaintCombination} paint  Tinta
     * @param {string} manufacturer Fornecedor da titna
     * @param {number} quantity Quantidade
     * @returns {Promise<Cart>} Carrinho
     * @memberof CartManager
     */
    purchasePaint(cartId: string, paint: CustomPaintCombination, manufacturer: string, quantity: number): Promise<Cart> {
        return new Promise((resolve, reject) => {
            console.log('Checking if cart exists');
            if (cartId) {
                console.log('Cart exists');
                this.getCart(cartId)
                    .then(cart => {
                        console.log('Adding item to cart');
                        return this.addPaint(paint.id, manufacturer, quantity, cart.id);
                    })
                    .then(cart => {
                        console.log('Item added to cart');
                        localStorage.setItem('shopping_cart', JSON.stringify(cart));
                        resolve(cart);
                    })
                    .catch(error => reject(error));
            }
            else {
                console.log(`Cart doen't exists`);
                let cart = new Cart();
                let cartItem = this.exportAsPaint(paint);
                cartItem.quantity = quantity;
                cartItem.manufacturer = manufacturer;
                cart.paints.push(cartItem);
                console.log('Creating new cart');
                this.createCart(cart, true)
                    .then(response => {
                        console.log('Cart successful created');
                        localStorage.setItem('shopping_cart', JSON.stringify(cart));
                        resolve(cart);
                    })
                    .catch(error => reject(error));
            }
        });
    }

    /**
     * Adiciona uma tinta a um carrinho já existente
     * 
     * @param {string} paintId 
     * @param {string} manufacturer 
     * @param {number} quantity 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    addPaint(paintId: string, manufacturer: string, quantity: number, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.addPaint(paintId, manufacturer, quantity, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Adiciona um produto à um carrinho já existente
     * 
     * @param {string} cartId 
     * @param {string} skuId 
     * @param {number} quantity 
     * @param {string} feature 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    addItem(cartId: string, skuId: string, quantity: number, feature: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {
                "skuId": skuId,
                "quantity": quantity,
                "feature": feature
            };
            this.service.sendToCart(item, cartId)
                .subscribe(cart => {
                    resolve(cart)
                }, error => reject(error));
        });
    }

    /**
     * Adiciona um serviço à um carrino já existente
     * 
     * @param {string} serviceId 
     * @param {number} quantity 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    addService(serviceId: string, quantity: number, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {
                "serviceId": serviceId,
                "quantity": quantity
            };
            this.service.sendServiceToCart(item, cartId)
                .subscribe(cart => {
                    resolve(cart)
                }, error => reject(error));
        });
    }

    /**
     * Cria um carrinho na API
     * 
     * @param {Cart} cart 
     * @param {boolean} [isPaint=false] 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    createCart(cart: Cart, isPaint: boolean = false): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let session_id: string = this.getSessionId();
            let zipCode: number = this.getZipcode();
            let origin = this.getOrigin();
            this.service.createCart(cart, isPaint, session_id, zipCode, origin)
                .subscribe(response => {
                    this.setCartId(response.id);
                    resolve(response);
                }, error => reject(error));
        });
    }

    /**
     * Atualiza um produto já adicionado ao carrinho
     * 
     * @param {CartItem} item 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    updateItem(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updateItem(item, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Atualiza um serviço já adicionado ao carrinho
     * 
     * @param {Service} item 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    updateItemService(item: Service, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updateItemService(item, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Atualiza uma tinta já adicionada ao carrinho
     * 
     * @param {CartItem} item 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    updatePaint(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updatePaint(item, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Remove um produto do carrinho
     * 
     * @param {CartItem} item 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    deleteItem(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deleteItem(item, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Remove um serviço do carrinho
     * 
     * @param {string} serviceId 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    deleteService(serviceId: string, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deleteService(serviceId, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Remove uma tinta do carrinho
     * 
     * @param {CartItem} item 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    deletePaint(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deletePaint(item, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Adiciona frete calculado ao carrinho
     * 
     * @param {Shipping} shipping 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    setShipping(shipping: Shipping, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.setShipping(shipping, cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Associa um cliente à um carrinho
     * 
     * @param {string} cartId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    setCustomerToCart(cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let token = this.getToken();
            this.service.setCustomerToCart(cartId, token)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        })
    }

    /**
     * Adiciona endereço de entrega ao carrinho
     * 
     * @param {string} cartId 
     * @param {string} addressId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    addDeliveryAddress(cartId: string, addressId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let token = this.getToken();
            this.service.addDeliveryAddress(cartId, addressId, token)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Adiciona endereço de cobrança ao carrinho
     * 
     * @param {string} cartId 
     * @param {string} addressId 
     * @returns {Promise<Cart>} 
     * @memberof CartManager
     */
    addBillingAddress(cartId: string, addressId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let token = this.getToken();
            this.service.addBillingAddress(cartId, addressId, token)
                .subscribe(cart => {
                    resolve(cart);
                }, error => reject(error));
        });
    }

    /**
     * Transforma um objeto CustomPaintCombination em objeto Paint
     * 
     * @param {CustomPaintCombination} combination 
     * @returns {Paint} 
     * @memberof CartManager
     */
    exportAsPaint(combination: CustomPaintCombination): Paint {
        return new Paint({
            id: combination.id,
            baseName: combination.name,
            colorCode: combination.color.code,
            colorName: combination.color.name,
            colorRgb: combination.color.rgb,
            manufacturer: combination.color.manufacturer,
            optionCode: combination.code,
            optionId: combination.variation.optionId,
            optionName: combination.variation.optionName,
            optionPicture: combination.variation.optionPicture
        });
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    getOrigin(): string {
        if (this.isMobile())
            return "mobile";
        return "desktop";
    }
}