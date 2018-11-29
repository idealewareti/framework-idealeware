import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { CustomerManager } from '../managers/customer.manager';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';

declare var swal: any;

@Injectable()
export class ForgotTokenGuard implements CanActivate {
    constructor(
        private customerManager: CustomerManager,
        private router: Router
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const token = route.params.token;

        return this.customerManager.validForgotPasswordToken(token)
            .pipe(map(() => true), catchError(e => {
                swal({
                    title: 'Problemas para recuperar senha!',
                    text: e.error,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                this.router.navigate(['recuperar-senha']);
                return throwError(e)
            }));
        }
}
