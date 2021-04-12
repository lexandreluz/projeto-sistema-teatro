import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AssentoComponent } from './list/assento.component';
import { AssentoDetailComponent } from './detail/assento-detail.component';
import { AssentoUpdateComponent } from './update/assento-update.component';
import { AssentoDeleteDialogComponent } from './delete/assento-delete-dialog.component';
import { AssentoRoutingModule } from './route/assento-routing.module';

@NgModule({
  imports: [SharedModule, AssentoRoutingModule],
  declarations: [AssentoComponent, AssentoDetailComponent, AssentoUpdateComponent, AssentoDeleteDialogComponent],
  entryComponents: [AssentoDeleteDialogComponent],
})
export class AssentoModule {}
