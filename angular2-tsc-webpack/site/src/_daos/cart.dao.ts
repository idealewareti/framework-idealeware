import {CartItem} from '../_models/cart/cart-item';
import {AppTexts} from '../app.texts';

export class CartDao{
    private connection;
    private dbStore = 'ideale-cart';

    constructor(connection){
        this.connection = connection;
    }

    addItem(item: CartItem){
        return new Promise((resolve, reject) => {
            let request = this.connection
                .transaction([this.dbStore], 'readwrite')
                .objectStore(this.dbStore)
                .add(item);

            request.onsuccess = e => {
                resolve();
            };

            request.onerror = e => {
                console.log(e.target.error);
                reject(AppTexts.CART_ADD_ERROR);
            };
        });
    }

    getAll(){
        return new Promise((resolve, reject) => {
            let cursor = this.connection.transaction([this.dbStore], 'readwrite')
                .objectStore(this.dbStore)
                .openCursor();
            
            let items = [];

            cursor.onsuccess = e => {
                let actual = e.target.result;
                if(actual){
                    let data = actual.value;
                    items.push(new CartItem(data));
                    actual.continue();
                }
                else{
                    resolve(items);
                }
            };

            cursor.onerror = e => {
                console.log(e.target.error.name);
                reject(AppTexts.CART_LOAD_ERROR);
            }
        });
    }

    update(item: CartItem){
        return new Promise((resolve, reject) => {
            let cursor = this.connection.transaction([this.dbStore], 'readwrite')
                .objectStore(this.dbStore)
                .openCursor();

            cursor.onsuccess = e => {
                let actual = e.target.result;
                if(actual){
                    if(this.equals(actual.value, item)){
                        let request = actual.update(item);
                    }

                    actual.continue();
                }
            };

            cursor.onerror = e => {
                console.log(e.target.error.name);
                reject(AppTexts.CART_LOAD_ERROR);
            }
        });
    }

    delete(item: CartItem){
        return new Promise((resolve, reject) => {
            let cursor = this.connection.transaction([this.dbStore], 'readwrite')
                .objectStore(this.dbStore)
                .openCursor();

            cursor.onsuccess = e => {
                let actual = e.target.result;
                if(actual){
                    if(this.equals(actual.value, item)){
                        this.remove(actual.primaryKey)
                            .then(() => resolve('OK'))
                            .catch(e => reject(e));
                    }

                    actual.continue();
                }
            };

            cursor.onerror = e => {
                console.log(e.target.error.name);
                reject(AppTexts.CART_LOAD_ERROR);
            }
        });
    }

    private remove(key){
        return new Promise((resolve, reject) => {
            let request = this.connection
                .transaction([this.dbStore], 'readwrite')
                .objectStore(this.dbStore)
                .delete(key);
            
            request.onsuccess = e => {
                resolve(e);
            };

            request.onerror = e => {
                reject(e);
            }
        });
    }
    
    private equals(value, item: CartItem){
        if(value.productItemId == item.productItemId) return true;
        else return false;
    }

    emptyCart(){
        return new Promise((resolve, reject) => {
            let request =  this.connection.transaction([this.dbStore], 'readwrite')
                .objectStore(this.dbStore)
                .clear();

            request.onsuccess = e => resolve(AppTexts.CART_EMPTY);

            request.onerror = e => {
                console.log(e.target.error);
                reject(AppTexts.CART_EMPTY_ERROR);
            }
        });
    }
}