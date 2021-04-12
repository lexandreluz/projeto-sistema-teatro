import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITeatro, getTeatroIdentifier } from '../teatro.model';

export type EntityResponseType = HttpResponse<ITeatro>;
export type EntityArrayResponseType = HttpResponse<ITeatro[]>;

@Injectable({ providedIn: 'root' })
export class TeatroService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/teatros');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(teatro: ITeatro): Observable<EntityResponseType> {
    return this.http.post<ITeatro>(this.resourceUrl, teatro, { observe: 'response' });
  }

  update(teatro: ITeatro): Observable<EntityResponseType> {
    return this.http.put<ITeatro>(`${this.resourceUrl}/${getTeatroIdentifier(teatro) as number}`, teatro, { observe: 'response' });
  }

  partialUpdate(teatro: ITeatro): Observable<EntityResponseType> {
    return this.http.patch<ITeatro>(`${this.resourceUrl}/${getTeatroIdentifier(teatro) as number}`, teatro, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeatro>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeatro[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTeatroToCollectionIfMissing(teatroCollection: ITeatro[], ...teatrosToCheck: (ITeatro | null | undefined)[]): ITeatro[] {
    const teatros: ITeatro[] = teatrosToCheck.filter(isPresent);
    if (teatros.length > 0) {
      const teatroCollectionIdentifiers = teatroCollection.map(teatroItem => getTeatroIdentifier(teatroItem)!);
      const teatrosToAdd = teatros.filter(teatroItem => {
        const teatroIdentifier = getTeatroIdentifier(teatroItem);
        if (teatroIdentifier == null || teatroCollectionIdentifiers.includes(teatroIdentifier)) {
          return false;
        }
        teatroCollectionIdentifiers.push(teatroIdentifier);
        return true;
      });
      return [...teatrosToAdd, ...teatroCollection];
    }
    return teatroCollection;
  }
}
