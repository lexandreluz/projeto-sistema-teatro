import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EventoComponent } from './list/evento.component';
import { EventoDetailComponent } from './detail/evento-detail.component';
import { EventoUpdateComponent } from './update/evento-update.component';
import { EventoDeleteDialogComponent } from './delete/evento-delete-dialog.component';
import { EventoRoutingModule } from './route/evento-routing.module';

@NgModule({
  imports: [SharedModule, EventoRoutingModule],
  declarations: [EventoComponent, EventoDetailComponent, EventoUpdateComponent, EventoDeleteDialogComponent],
  entryComponents: [EventoDeleteDialogComponent],
})
export class EventoModule {}
