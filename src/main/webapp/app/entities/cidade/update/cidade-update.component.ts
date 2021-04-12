import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICidade, Cidade } from '../cidade.model';
import { CidadeService } from '../service/cidade.service';

@Component({
  selector: 'jhi-cidade-update',
  templateUrl: './cidade-update.component.html',
})
export class CidadeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nomeCidade: [],
    uf: [],
  });

  constructor(protected cidadeService: CidadeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cidade }) => {
      this.updateForm(cidade);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cidade = this.createFromForm();
    if (cidade.id !== undefined) {
      this.subscribeToSaveResponse(this.cidadeService.update(cidade));
    } else {
      this.subscribeToSaveResponse(this.cidadeService.create(cidade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICidade>>): void {
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

  protected updateForm(cidade: ICidade): void {
    this.editForm.patchValue({
      id: cidade.id,
      nomeCidade: cidade.nomeCidade,
      uf: cidade.uf,
    });
  }

  protected createFromForm(): ICidade {
    return {
      ...new Cidade(),
      id: this.editForm.get(['id'])!.value,
      nomeCidade: this.editForm.get(['nomeCidade'])!.value,
      uf: this.editForm.get(['uf'])!.value,
    };
  }
}
