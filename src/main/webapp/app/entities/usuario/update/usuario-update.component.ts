import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUsuario, Usuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { IIngresso } from 'app/entities/ingresso/ingresso.model';
import { IngressoService } from 'app/entities/ingresso/service/ingresso.service';

@Component({
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;

  ingressosSharedCollection: IIngresso[] = [];

  editForm = this.fb.group({
    id: [],
    idUsuario: [],
    nome: [],
    cpf: [],
    ingresso: [],
  });

  constructor(
    protected usuarioService: UsuarioService,
    protected ingressoService: IngressoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.updateForm(usuario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.createFromForm();
    if (usuario.id !== undefined) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  trackIngressoById(index: number, item: IIngresso): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(usuario: IUsuario): void {
    this.editForm.patchValue({
      id: usuario.id,
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      cpf: usuario.cpf,
      ingresso: usuario.ingresso,
    });

    this.ingressosSharedCollection = this.ingressoService.addIngressoToCollectionIfMissing(
      this.ingressosSharedCollection,
      usuario.ingresso
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ingressoService
      .query()
      .pipe(map((res: HttpResponse<IIngresso[]>) => res.body ?? []))
      .pipe(
        map((ingressos: IIngresso[]) =>
          this.ingressoService.addIngressoToCollectionIfMissing(ingressos, this.editForm.get('ingresso')!.value)
        )
      )
      .subscribe((ingressos: IIngresso[]) => (this.ingressosSharedCollection = ingressos));
  }

  protected createFromForm(): IUsuario {
    return {
      ...new Usuario(),
      id: this.editForm.get(['id'])!.value,
      idUsuario: this.editForm.get(['idUsuario'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cpf: this.editForm.get(['cpf'])!.value,
      ingresso: this.editForm.get(['ingresso'])!.value,
    };
  }
}
