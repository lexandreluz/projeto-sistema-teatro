import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITeatro, Teatro } from '../teatro.model';
import { TeatroService } from '../service/teatro.service';
import { ICidade } from 'app/entities/cidade/cidade.model';
import { CidadeService } from 'app/entities/cidade/service/cidade.service';

@Component({
  selector: 'jhi-teatro-update',
  templateUrl: './teatro-update.component.html',
})
export class TeatroUpdateComponent implements OnInit {
  isSaving = false;

  cidadesSharedCollection: ICidade[] = [];

  editForm = this.fb.group({
    id: [],
    idTeatro: [],
    nomeTeatro: [],
    endereco: [],
    cidade: [],
  });

  constructor(
    protected teatroService: TeatroService,
    protected cidadeService: CidadeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teatro }) => {
      this.updateForm(teatro);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const teatro = this.createFromForm();
    if (teatro.id !== undefined) {
      this.subscribeToSaveResponse(this.teatroService.update(teatro));
    } else {
      this.subscribeToSaveResponse(this.teatroService.create(teatro));
    }
  }

  trackCidadeById(index: number, item: ICidade): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeatro>>): void {
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

  protected updateForm(teatro: ITeatro): void {
    this.editForm.patchValue({
      id: teatro.id,
      idTeatro: teatro.idTeatro,
      nomeTeatro: teatro.nomeTeatro,
      endereco: teatro.endereco,
      cidade: teatro.cidade,
    });

    this.cidadesSharedCollection = this.cidadeService.addCidadeToCollectionIfMissing(this.cidadesSharedCollection, teatro.cidade);
  }

  protected loadRelationshipsOptions(): void {
    this.cidadeService
      .query()
      .pipe(map((res: HttpResponse<ICidade[]>) => res.body ?? []))
      .pipe(map((cidades: ICidade[]) => this.cidadeService.addCidadeToCollectionIfMissing(cidades, this.editForm.get('cidade')!.value)))
      .subscribe((cidades: ICidade[]) => (this.cidadesSharedCollection = cidades));
  }

  protected createFromForm(): ITeatro {
    return {
      ...new Teatro(),
      id: this.editForm.get(['id'])!.value,
      idTeatro: this.editForm.get(['idTeatro'])!.value,
      nomeTeatro: this.editForm.get(['nomeTeatro'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
    };
  }
}
