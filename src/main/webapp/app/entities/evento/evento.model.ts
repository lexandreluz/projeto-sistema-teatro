import { ITeatro } from 'app/entities/teatro/teatro.model';
import { IIngresso } from 'app/entities/ingresso/ingresso.model';

export interface IEvento {
  id?: number;
  idEvento?: string | null;
  nomeEvento?: string | null;
  descricao?: string | null;
  teatro?: ITeatro | null;
  ingressos?: IIngresso[] | null;
}

export class Evento implements IEvento {
  constructor(
    public id?: number,
    public idEvento?: string | null,
    public nomeEvento?: string | null,
    public descricao?: string | null,
    public teatro?: ITeatro | null,
    public ingressos?: IIngresso[] | null
  ) {}
}

export function getEventoIdentifier(evento: IEvento): number | undefined {
  return evento.id;
}
