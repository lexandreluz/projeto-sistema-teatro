import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIngresso, getIngressoIdentifier } from '../ingresso.model';

export type EntityResponseType = HttpResponse<IIngresso>;
export type EntityArrayResponseType = HttpResponse<IIngresso[]>;

@Injectable({ providedIn: 'root' })
export class IngressoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ingressos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(ingresso: IIngresso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingresso);
    return this.http
      .post<IIngresso>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ingresso: IIngresso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingresso);
    return this.http
      .put<IIngresso>(`${this.resourceUrl}/${getIngressoIdentifier(ingresso) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ingresso: IIngresso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingresso);
    return this.http
      .patch<IIngresso>(`${this.resourceUrl}/${getIngressoIdentifier(ingresso) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIngresso>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIngresso[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIngressoToCollectionIfMissing(ingressoCollection: IIngresso[], ...ingressosToCheck: (IIngresso | null | undefined)[]): IIngresso[] {
    const ingressos: IIngresso[] = ingressosToCheck.filter(isPresent);
    if (ingressos.length > 0) {
      const ingressoCollectionIdentifiers = ingressoCollection.map(ingressoItem => getIngressoIdentifier(ingressoItem)!);
      const ingressosToAdd = ingressos.filter(ingressoItem => {
        const ingressoIdentifier = getIngressoIdentifier(ingressoItem);
        if (ingressoIdentifier == null || ingressoCollectionIdentifiers.includes(ingressoIdentifier)) {
          return false;
        }
        ingressoCollectionIdentifiers.push(ingressoIdentifier);
        return true;
      });
      return [...ingressosToAdd, ...ingressoCollection];
    }
    return ingressoCollection;
  }

  protected convertDateFromClient(ingresso: IIngresso): IIngresso {
    return Object.assign({}, ingresso, {
      dataCompra: ingresso.dataCompra?.isValid() ? ingresso.dataCompra.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataCompra = res.body.dataCompra ? dayjs(res.body.dataCompra) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ingresso: IIngresso) => {
        ingresso.dataCompra = ingresso.dataCompra ? dayjs(ingresso.dataCompra) : undefined;
      });
    }
    return res;
  }
}
