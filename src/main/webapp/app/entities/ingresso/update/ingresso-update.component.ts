import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IIngresso, Ingresso } from '../ingresso.model';
import { IngressoService } from '../service/ingresso.service';
import { IEvento } from 'app/entities/evento/evento.model';
import { EventoService } from 'app/entities/evento/service/evento.service';

@Component({
  selector: 'jhi-ingresso-update',
  templateUrl: './ingresso-update.component.html',
})
export class IngressoUpdateComponent implements OnInit {
  isSaving = false;

  eventosSharedCollection: IEvento[] = [];

  editForm = this.fb.group({
    id: [],
    idIngresso: [],
    dataCompra: [],
    valor: [],
    evento: [],
  });

  constructor(
    protected ingressoService: IngressoService,
    protected eventoService: EventoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingresso }) => {
      if (ingresso.id === undefined) {
        const today = dayjs().startOf('day');
        ingresso.dataCompra = today;
      }

      this.updateForm(ingresso);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ingresso = this.createFromForm();
    if (ingresso.id !== undefined) {
      this.subscribeToSaveResponse(this.ingressoService.update(ingresso));
    } else {
      this.subscribeToSaveResponse(this.ingressoService.create(ingresso));
    }
  }

  trackEventoById(index: number, item: IEvento): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIngresso>>): void {
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

  protected updateForm(ingresso: IIngresso): void {
    this.editForm.patchValue({
      id: ingresso.id,
      idIngresso: ingresso.idIngresso,
      dataCompra: ingresso.dataCompra ? ingresso.dataCompra.format(DATE_TIME_FORMAT) : null,
      valor: ingresso.valor,
      evento: ingresso.evento,
    });

    this.eventosSharedCollection = this.eventoService.addEventoToCollectionIfMissing(this.eventosSharedCollection, ingresso.evento);
  }

  protected loadRelationshipsOptions(): void {
    this.eventoService
      .query()
      .pipe(map((res: HttpResponse<IEvento[]>) => res.body ?? []))
      .pipe(map((eventos: IEvento[]) => this.eventoService.addEventoToCollectionIfMissing(eventos, this.editForm.get('evento')!.value)))
      .subscribe((eventos: IEvento[]) => (this.eventosSharedCollection = eventos));
  }

  protected createFromForm(): IIngresso {
    return {
      ...new Ingresso(),
      id: this.editForm.get(['id'])!.value,
      idIngresso: this.editForm.get(['idIngresso'])!.value,
      dataCompra: this.editForm.get(['dataCompra'])!.value ? dayjs(this.editForm.get(['dataCompra'])!.value, DATE_TIME_FORMAT) : undefined,
      valor: this.editForm.get(['valor'])!.value,
      evento: this.editForm.get(['evento'])!.value,
    };
  }
}
