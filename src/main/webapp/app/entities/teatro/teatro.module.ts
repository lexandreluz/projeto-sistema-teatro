import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TeatroComponent } from './list/teatro.component';
import { TeatroDetailComponent } from './detail/teatro-detail.component';
import { TeatroUpdateComponent } from './update/teatro-update.component';
import { TeatroDeleteDialogComponent } from './delete/teatro-delete-dialog.component';
import { TeatroRoutingModule } from './route/teatro-routing.module';

@NgModule({
  imports: [SharedModule, TeatroRoutingModule],
  declarations: [TeatroComponent, TeatroDetailComponent, TeatroUpdateComponent, TeatroDeleteDialogComponent],
  entryComponents: [TeatroDeleteDialogComponent],
})
export class TeatroModule {}
