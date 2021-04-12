import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIngresso } from '../ingresso.model';
import { IngressoService } from '../service/ingresso.service';
import { IngressoDeleteDialogComponent } from '../delete/ingresso-delete-dialog.component';

@Component({
  selector: 'jhi-ingresso',
  templateUrl: './ingresso.component.html',
})
export class IngressoComponent implements OnInit {
  ingressos?: IIngresso[];
  isLoading = false;

  constructor(protected ingressoService: IngressoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ingressoService.query().subscribe(
      (res: HttpResponse<IIngresso[]>) => {
        this.isLoading = false;
        this.ingressos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIngresso): number {
    return item.id!;
  }

  delete(ingresso: IIngresso): void {
    const modalRef = this.modalService.open(IngressoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ingresso = ingresso;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
