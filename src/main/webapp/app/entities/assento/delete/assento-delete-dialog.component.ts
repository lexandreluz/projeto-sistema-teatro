import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAssento } from '../assento.model';
import { AssentoService } from '../service/assento.service';

@Component({
  templateUrl: './assento-delete-dialog.component.html',
})
export class AssentoDeleteDialogComponent {
  assento?: IAssento;

  constructor(protected assentoService: AssentoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assentoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
