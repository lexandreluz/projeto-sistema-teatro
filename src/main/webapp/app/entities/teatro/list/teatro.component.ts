import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeatro } from '../teatro.model';
import { TeatroService } from '../service/teatro.service';
import { TeatroDeleteDialogComponent } from '../delete/teatro-delete-dialog.component';

@Component({
  selector: 'jhi-teatro',
  templateUrl: './teatro.component.html',
})
export class TeatroComponent implements OnInit {
  teatros?: ITeatro[];
  isLoading = false;

  constructor(protected teatroService: TeatroService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.teatroService.query().subscribe(
      (res: HttpResponse<ITeatro[]>) => {
        this.isLoading = false;
        this.teatros = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITeatro): number {
    return item.id!;
  }

  delete(teatro: ITeatro): void {
    const modalRef = this.modalService.open(TeatroDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.teatro = teatro;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
