import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEvento } from '../evento.model';
import { EventoService } from '../service/evento.service';

@Component({
  templateUrl: './evento-delete-dialog.component.html',
})
export class EventoDeleteDialogComponent {
  evento?: IEvento;

  constructor(protected eventoService: EventoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
