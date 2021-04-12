import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAssento, Assento } from '../assento.model';
import { AssentoService } from '../service/assento.service';

@Injectable({ providedIn: 'root' })
export class AssentoRoutingResolveService implements Resolve<IAssento> {
  constructor(protected service: AssentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAssento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((assento: HttpResponse<Assento>) => {
          if (assento.body) {
            return of(assento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Assento());
  }
}
