import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICidade, getCidadeIdentifier } from '../cidade.model';

export type EntityResponseType = HttpResponse<ICidade>;
export type EntityArrayResponseType = HttpResponse<ICidade[]>;

@Injectable({ providedIn: 'root' })
export class CidadeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/cidades');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(cidade: ICidade): Observable<EntityResponseType> {
    return this.http.post<ICidade>(this.resourceUrl, cidade, { observe: 'response' });
  }

  update(cidade: ICidade): Observable<EntityResponseType> {
    return this.http.put<ICidade>(`${this.resourceUrl}/${getCidadeIdentifier(cidade) as number}`, cidade, { observe: 'response' });
  }

  partialUpdate(cidade: ICidade): Observable<EntityResponseType> {
    return this.http.patch<ICidade>(`${this.resourceUrl}/${getCidadeIdentifier(cidade) as number}`, cidade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICidade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICidade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCidadeToCollectionIfMissing(cidadeCollection: ICidade[], ...cidadesToCheck: (ICidade | null | undefined)[]): ICidade[] {
    const cidades: ICidade[] = cidadesToCheck.filter(isPresent);
    if (cidades.length > 0) {
      const cidadeCollectionIdentifiers = cidadeCollection.map(cidadeItem => getCidadeIdentifier(cidadeItem)!);
      const cidadesToAdd = cidades.filter(cidadeItem => {
        const cidadeIdentifier = getCidadeIdentifier(cidadeItem);
        if (cidadeIdentifier == null || cidadeCollectionIdentifiers.includes(cidadeIdentifier)) {
          return false;
        }
        cidadeCollectionIdentifiers.push(cidadeIdentifier);
        return true;
      });
      return [...cidadesToAdd, ...cidadeCollection];
    }
    return cidadeCollection;
  }
}
