import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeatro } from '../teatro.model';
import { TeatroService } from '../service/teatro.service';

@Component({
  templateUrl: './teatro-delete-dialog.component.html',
})
export class TeatroDeleteDialogComponent {
  teatro?: ITeatro;

  constructor(protected teatroService: TeatroService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teatroService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
