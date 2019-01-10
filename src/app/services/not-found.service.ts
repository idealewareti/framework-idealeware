import { Injectable } from '@angular/core';

const URLS_BLOCK_NOTFOUND = [
    "/checkout",
    "/conta",
    "/carrinho",
    "/login",
    "/cadastrar"
]

@Injectable({
    providedIn: "root"
})
export class NotFoundService {
    isBlockUrl = false;
    isNotFound(url: string): boolean {
        return !URLS_BLOCK_NOTFOUND.includes(url);
    }
}