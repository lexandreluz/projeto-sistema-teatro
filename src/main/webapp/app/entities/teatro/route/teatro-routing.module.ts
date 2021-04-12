import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeatroComponent } from '../list/teatro.component';
import { TeatroDetailComponent } from '../detail/teatro-detail.component';
import { TeatroUpdateComponent } from '../update/teatro-update.component';
import { TeatroRoutingResolveService } from './teatro-routing-resolve.service';

const teatroRoute: Routes = [
  {
    path: '',
    component: TeatroComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeatroDetailComponent,
    resolve: {
      teatro: TeatroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeatroUpdateComponent,
    resolve: {
      teatro: TeatroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeatroUpdateComponent,
    resolve: {
      teatro: TeatroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(teatroRoute)],
  exports: [RouterModule],
})
export class TeatroRoutingModule {}
