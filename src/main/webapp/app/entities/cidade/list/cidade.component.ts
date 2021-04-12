import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICidade } from '../cidade.model';
import { CidadeService } from '../service/cidade.service';
import { CidadeDeleteDialogComponent } from '../delete/cidade-delete-dialog.component';

@Component({
  selector: 'jhi-cidade',
  templateUrl: './cidade.component.html',
})
export class CidadeComponent implements OnInit {
  cidades?: ICidade[];
  isLoading = false;

  constructor(protected cidadeService: CidadeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cidadeService.query().subscribe(
      (res: HttpResponse<ICidade[]>) => {
        this.isLoading = false;
        this.cidades = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICidade): number {
    return item.id!;
  }

  delete(cidade: ICidade): void {
    const modalRef = this.modalService.open(CidadeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cidade = cidade;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
