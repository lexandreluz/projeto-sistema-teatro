import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIngresso, Ingresso } from '../ingresso.model';
import { IngressoService } from '../service/ingresso.service';

@Injectable({ providedIn: 'root' })
export class IngressoRoutingResolveService implements Resolve<IIngresso> {
  constructor(protected service: IngressoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIngresso> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ingresso: HttpResponse<Ingresso>) => {
          if (ingresso.body) {
            return of(ingresso.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ingresso());
  }
}
