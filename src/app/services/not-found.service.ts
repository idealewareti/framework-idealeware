import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
        for (var route of URLS_BLOCK_NOTFOUND) {
            var urlBlock = url.includes(route);
            if (urlBlock)
                return this.isBlockUrl;
        }
    }
}