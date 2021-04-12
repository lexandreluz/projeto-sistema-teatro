import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIngresso } from '../ingresso.model';
import { IngressoService } from '../service/ingresso.service';

@Component({
  templateUrl: './ingresso-delete-dialog.component.html',
})
export class IngressoDeleteDialogComponent {
  ingresso?: IIngresso;

  constructor(protected ingressoService: IngressoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ingressoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
