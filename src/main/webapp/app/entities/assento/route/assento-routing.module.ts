import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AssentoComponent } from '../list/assento.component';
import { AssentoDetailComponent } from '../detail/assento-detail.component';
import { AssentoUpdateComponent } from '../update/assento-update.component';
import { AssentoRoutingResolveService } from './assento-routing-resolve.service';

const assentoRoute: Routes = [
  {
    path: '',
    component: AssentoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssentoDetailComponent,
    resolve: {
      assento: AssentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssentoUpdateComponent,
    resolve: {
      assento: AssentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssentoUpdateComponent,
    resolve: {
      assento: AssentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(assentoRoute)],
  exports: [RouterModule],
})
export class AssentoRoutingModule {}
