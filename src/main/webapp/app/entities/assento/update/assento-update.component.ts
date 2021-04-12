import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAssento, Assento } from '../assento.model';
import { AssentoService } from '../service/assento.service';
import { ITeatro } from 'app/entities/teatro/teatro.model';
import { TeatroService } from 'app/entities/teatro/service/teatro.service';

@Component({
  selector: 'jhi-assento-update',
  templateUrl: './assento-update.component.html',
})
export class AssentoUpdateComponent implements OnInit {
  isSaving = false;

  teatrosSharedCollection: ITeatro[] = [];

  editForm = this.fb.group({
    id: [],
    numeracao: [],
    status: [],
    teatro: [],
  });

  constructor(
    protected assentoService: AssentoService,
    protected teatroService: TeatroService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assento }) => {
      this.updateForm(assento);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const assento = this.createFromForm();
    if (assento.id !== undefined) {
      this.subscribeToSaveResponse(this.assentoService.update(assento));
    } else {
      this.subscribeToSaveResponse(this.assentoService.create(assento));
    }
  }

  trackTeatroById(index: number, item: ITeatro): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssento>>): void {
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

  protected updateForm(assento: IAssento): void {
    this.editForm.patchValue({
      id: assento.id,
      numeracao: assento.numeracao,
      status: assento.status,
      teatro: assento.teatro,
    });

    this.teatrosSharedCollection = this.teatroService.addTeatroToCollectionIfMissing(this.teatrosSharedCollection, assento.teatro);
  }

  protected loadRelationshipsOptions(): void {
    this.teatroService
      .query()
      .pipe(map((res: HttpResponse<ITeatro[]>) => res.body ?? []))
      .pipe(map((teatros: ITeatro[]) => this.teatroService.addTeatroToCollectionIfMissing(teatros, this.editForm.get('teatro')!.value)))
      .subscribe((teatros: ITeatro[]) => (this.teatrosSharedCollection = teatros));
  }

  protected createFromForm(): IAssento {
    return {
      ...new Assento(),
      id: this.editForm.get(['id'])!.value,
      numeracao: this.editForm.get(['numeracao'])!.value,
      status: this.editForm.get(['status'])!.value,
      teatro: this.editForm.get(['teatro'])!.value,
    };
  }
}
