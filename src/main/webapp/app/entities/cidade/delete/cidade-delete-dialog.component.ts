import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICidade } from '../cidade.model';
import { CidadeService } from '../service/cidade.service';

@Component({
  templateUrl: './cidade-delete-dialog.component.html',
})
export class CidadeDeleteDialogComponent {
  cidade?: ICidade;

  constructor(protected cidadeService: CidadeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cidadeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
