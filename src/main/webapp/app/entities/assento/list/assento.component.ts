import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAssento } from '../assento.model';
import { AssentoService } from '../service/assento.service';
import { AssentoDeleteDialogComponent } from '../delete/assento-delete-dialog.component';

@Component({
  selector: 'jhi-assento',
  templateUrl: './assento.component.html',
})
export class AssentoComponent implements OnInit {
  assentos?: IAssento[];
  isLoading = false;

  constructor(protected assentoService: AssentoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.assentoService.query().subscribe(
      (res: HttpResponse<IAssento[]>) => {
        this.isLoading = false;
        this.assentos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAssento): number {
    return item.id!;
  }

  delete(assento: IAssento): void {
    const modalRef = this.modalService.open(AssentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.assento = assento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
