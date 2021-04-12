import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { IngressoComponent } from './list/ingresso.component';
import { IngressoDetailComponent } from './detail/ingresso-detail.component';
import { IngressoUpdateComponent } from './update/ingresso-update.component';
import { IngressoDeleteDialogComponent } from './delete/ingresso-delete-dialog.component';
import { IngressoRoutingModule } from './route/ingresso-routing.module';

@NgModule({
  imports: [SharedModule, IngressoRoutingModule],
  declarations: [IngressoComponent, IngressoDetailComponent, IngressoUpdateComponent, IngressoDeleteDialogComponent],
  entryComponents: [IngressoDeleteDialogComponent],
})
export class IngressoModule {}
