import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEvento, Evento } from '../evento.model';
import { EventoService } from '../service/evento.service';
import { ITeatro } from 'app/entities/teatro/teatro.model';
import { TeatroService } from 'app/entities/teatro/service/teatro.service';

@Component({
  selector: 'jhi-evento-update',
  templateUrl: './evento-update.component.html',
})
export class EventoUpdateComponent implements OnInit {
  isSaving = false;

  teatrosSharedCollection: ITeatro[] = [];

  editForm = this.fb.group({
    id: [],
    idEvento: [],
    nomeEvento: [],
    descricao: [],
    teatro: [],
  });

  constructor(
    protected eventoService: EventoService,
    protected teatroService: TeatroService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ evento }) => {
      this.updateForm(evento);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const evento = this.createFromForm();
    if (evento.id !== undefined) {
      this.subscribeToSaveResponse(this.eventoService.update(evento));
    } else {
      this.subscribeToSaveResponse(this.eventoService.create(evento));
    }
  }

  trackTeatroById(index: number, item: ITeatro): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvento>>): void {
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

  protected updateForm(evento: IEvento): void {
    this.editForm.patchValue({
      id: evento.id,
      idEvento: evento.idEvento,
      nomeEvento: evento.nomeEvento,
      descricao: evento.descricao,
      teatro: evento.teatro,
    });

    this.teatrosSharedCollection = this.teatroService.addTeatroToCollectionIfMissing(this.teatrosSharedCollection, evento.teatro);
  }

  protected loadRelationshipsOptions(): void {
    this.teatroService
      .query()
      .pipe(map((res: HttpResponse<ITeatro[]>) => res.body ?? []))
      .pipe(map((teatros: ITeatro[]) => this.teatroService.addTeatroToCollectionIfMissing(teatros, this.editForm.get('teatro')!.value)))
      .subscribe((teatros: ITeatro[]) => (this.teatrosSharedCollection = teatros));
  }

  protected createFromForm(): IEvento {
    return {
      ...new Evento(),
      id: this.editForm.get(['id'])!.value,
      idEvento: this.editForm.get(['idEvento'])!.value,
      nomeEvento: this.editForm.get(['nomeEvento'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      teatro: this.editForm.get(['teatro'])!.value,
    };
  }
}
