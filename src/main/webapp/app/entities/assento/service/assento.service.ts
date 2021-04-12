import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssento, getAssentoIdentifier } from '../assento.model';

export type EntityResponseType = HttpResponse<IAssento>;
export type EntityArrayResponseType = HttpResponse<IAssento[]>;

@Injectable({ providedIn: 'root' })
export class AssentoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/assentos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(assento: IAssento): Observable<EntityResponseType> {
    return this.http.post<IAssento>(this.resourceUrl, assento, { observe: 'response' });
  }

  update(assento: IAssento): Observable<EntityResponseType> {
    return this.http.put<IAssento>(`${this.resourceUrl}/${getAssentoIdentifier(assento) as number}`, assento, { observe: 'response' });
  }

  partialUpdate(assento: IAssento): Observable<EntityResponseType> {
    return this.http.patch<IAssento>(`${this.resourceUrl}/${getAssentoIdentifier(assento) as number}`, assento, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAssento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAssento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAssentoToCollectionIfMissing(assentoCollection: IAssento[], ...assentosToCheck: (IAssento | null | undefined)[]): IAssento[] {
    const assentos: IAssento[] = assentosToCheck.filter(isPresent);
    if (assentos.length > 0) {
      const assentoCollectionIdentifiers = assentoCollection.map(assentoItem => getAssentoIdentifier(assentoItem)!);
      const assentosToAdd = assentos.filter(assentoItem => {
        const assentoIdentifier = getAssentoIdentifier(assentoItem);
        if (assentoIdentifier == null || assentoCollectionIdentifiers.includes(assentoIdentifier)) {
          return false;
        }
        assentoCollectionIdentifiers.push(assentoIdentifier);
        return true;
      });
      return [...assentosToAdd, ...assentoCollection];
    }
    return assentoCollection;
  }
}
