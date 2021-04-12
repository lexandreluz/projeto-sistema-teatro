import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvento, Evento } from '../evento.model';
import { EventoService } from '../service/evento.service';

@Injectable({ providedIn: 'root' })
export class EventoRoutingResolveService implements Resolve<IEvento> {
  constructor(protected service: EventoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((evento: HttpResponse<Evento>) => {
          if (evento.body) {
            return of(evento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Evento());
  }
}
