import { ITeatro } from 'app/entities/teatro/teatro.model';

export interface ICidade {
  id?: number;
  nomeCidade?: string | null;
  uf?: string | null;
  teatros?: ITeatro[] | null;
}

export class Cidade implements ICidade {
  constructor(public id?: number, public nomeCidade?: string | null, public uf?: string | null, public teatros?: ITeatro[] | null) {}
}

export function getCidadeIdentifier(cidade: ICidade): number | undefined {
  return cidade.id;
}
