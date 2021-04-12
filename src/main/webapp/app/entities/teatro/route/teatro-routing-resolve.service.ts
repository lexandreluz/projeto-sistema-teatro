import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeatro, Teatro } from '../teatro.model';
import { TeatroService } from '../service/teatro.service';

@Injectable({ providedIn: 'root' })
export class TeatroRoutingResolveService implements Resolve<ITeatro> {
  constructor(protected service: TeatroService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeatro> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((teatro: HttpResponse<Teatro>) => {
          if (teatro.body) {
            return of(teatro.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Teatro());
  }
}
