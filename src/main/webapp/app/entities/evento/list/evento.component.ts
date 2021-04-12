import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEvento } from '../evento.model';
import { EventoService } from '../service/evento.service';
import { EventoDeleteDialogComponent } from '../delete/evento-delete-dialog.component';

@Component({
  selector: 'jhi-evento',
  templateUrl: './evento.component.html',
})
export class EventoComponent implements OnInit {
  eventos?: IEvento[];
  isLoading = false;

  constructor(protected eventoService: EventoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.eventoService.query().subscribe(
      (res: HttpResponse<IEvento[]>) => {
        this.isLoading = false;
        this.eventos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEvento): number {
    return item.id!;
  }

  delete(evento: IEvento): void {
    const modalRef = this.modalService.open(EventoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.evento = evento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
