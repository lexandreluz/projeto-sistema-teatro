import { ITeatro } from 'app/entities/teatro/teatro.model';

export interface IAssento {
  id?: number;
  numeracao?: number | null;
  status?: boolean | null;
  teatro?: ITeatro | null;
}

export class Assento implements IAssento {
  constructor(public id?: number, public numeracao?: number | null, public status?: boolean | null, public teatro?: ITeatro | null) {
    this.status = this.status ?? false;
  }
}

export function getAssentoIdentifier(assento: IAssento): number | undefined {
  return assento.id;
}
