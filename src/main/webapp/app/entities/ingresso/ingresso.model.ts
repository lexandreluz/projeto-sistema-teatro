import * as dayjs from 'dayjs';
import { IEvento } from 'app/entities/evento/evento.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IIngresso {
  id?: number;
  idIngresso?: number | null;
  dataCompra?: dayjs.Dayjs | null;
  valor?: number | null;
  evento?: IEvento | null;
  usuarios?: IUsuario[] | null;
}

export class Ingresso implements IIngresso {
  constructor(
    public id?: number,
    public idIngresso?: number | null,
    public dataCompra?: dayjs.Dayjs | null,
    public valor?: number | null,
    public evento?: IEvento | null,
    public usuarios?: IUsuario[] | null
  ) {}
}

export function getIngressoIdentifier(ingresso: IIngresso): number | undefined {
  return ingresso.id;
}
