import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEvento, getEventoIdentifier } from '../evento.model';

export type EntityResponseType = HttpResponse<IEvento>;
export type EntityArrayResponseType = HttpResponse<IEvento[]>;

@Injectable({ providedIn: 'root' })
export class EventoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/eventos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(evento: IEvento): Observable<EntityResponseType> {
    return this.http.post<IEvento>(this.resourceUrl, evento, { observe: 'response' });
  }

  update(evento: IEvento): Observable<EntityResponseType> {
    return this.http.put<IEvento>(`${this.resourceUrl}/${getEventoIdentifier(evento) as number}`, evento, { observe: 'response' });
  }

  partialUpdate(evento: IEvento): Observable<EntityResponseType> {
    return this.http.patch<IEvento>(`${this.resourceUrl}/${getEventoIdentifier(evento) as number}`, evento, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEvento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEvento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEventoToCollectionIfMissing(eventoCollection: IEvento[], ...eventosToCheck: (IEvento | null | undefined)[]): IEvento[] {
    const eventos: IEvento[] = eventosToCheck.filter(isPresent);
    if (eventos.length > 0) {
      const eventoCollectionIdentifiers = eventoCollection.map(eventoItem => getEventoIdentifier(eventoItem)!);
      const eventosToAdd = eventos.filter(eventoItem => {
        const eventoIdentifier = getEventoIdentifier(eventoItem);
        if (eventoIdentifier == null || eventoCollectionIdentifiers.includes(eventoIdentifier)) {
          return false;
        }
        eventoCollectionIdentifiers.push(eventoIdentifier);
        return true;
      });
      return [...eventosToAdd, ...eventoCollection];
    }
    return eventoCollection;
  }
}
