import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsuario, getUsuarioIdentifier } from '../usuario.model';

export type EntityResponseType = HttpResponse<IUsuario>;
export type EntityArrayResponseType = HttpResponse<IUsuario[]>;

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/usuarios');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(usuario: IUsuario): Observable<EntityResponseType> {
    return this.http.post<IUsuario>(this.resourceUrl, usuario, { observe: 'response' });
  }

  update(usuario: IUsuario): Observable<EntityResponseType> {
    return this.http.put<IUsuario>(`${this.resourceUrl}/${getUsuarioIdentifier(usuario) as number}`, usuario, { observe: 'response' });
  }

  partialUpdate(usuario: IUsuario): Observable<EntityResponseType> {
    return this.http.patch<IUsuario>(`${this.resourceUrl}/${getUsuarioIdentifier(usuario) as number}`, usuario, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsuario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUsuarioToCollectionIfMissing(usuarioCollection: IUsuario[], ...usuariosToCheck: (IUsuario | null | undefined)[]): IUsuario[] {
    const usuarios: IUsuario[] = usuariosToCheck.filter(isPresent);
    if (usuarios.length > 0) {
      const usuarioCollectionIdentifiers = usuarioCollection.map(usuarioItem => getUsuarioIdentifier(usuarioItem)!);
      const usuariosToAdd = usuarios.filter(usuarioItem => {
        const usuarioIdentifier = getUsuarioIdentifier(usuarioItem);
        if (usuarioIdentifier == null || usuarioCollectionIdentifiers.includes(usuarioIdentifier)) {
          return false;
        }
        usuarioCollectionIdentifiers.push(usuarioIdentifier);
        return true;
      });
      return [...usuariosToAdd, ...usuarioCollection];
    }
    return usuarioCollection;
  }
}
