import { IIngresso } from 'app/entities/ingresso/ingresso.model';

export interface IUsuario {
  id?: number;
  idUsuario?: number | null;
  nome?: string | null;
  cpf?: string | null;
  ingresso?: IIngresso | null;
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public idUsuario?: number | null,
    public nome?: string | null,
    public cpf?: string | null,
    public ingresso?: IIngresso | null
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
