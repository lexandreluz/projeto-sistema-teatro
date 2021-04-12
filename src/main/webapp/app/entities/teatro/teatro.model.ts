import { ICidade } from 'app/entities/cidade/cidade.model';
import { IEvento } from 'app/entities/evento/evento.model';
import { IAssento } from 'app/entities/assento/assento.model';

export interface ITeatro {
  id?: number;
  idTeatro?: number | null;
  nomeTeatro?: string | null;
  endereco?: string | null;
  cidade?: ICidade | null;
  eventos?: IEvento[] | null;
  assentos?: IAssento[] | null;
}

export class Teatro implements ITeatro {
  constructor(
    public id?: number,
    public idTeatro?: number | null,
    public nomeTeatro?: string | null,
    public endereco?: string | null,
    public cidade?: ICidade | null,
    public eventos?: IEvento[] | null,
    public assentos?: IAssento[] | null
  ) {}
}

export function getTeatroIdentifier(teatro: ITeatro): number | undefined {
  return teatro.id;
}
