import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CidadeComponent } from '../list/cidade.component';
import { CidadeDetailComponent } from '../detail/cidade-detail.component';
import { CidadeUpdateComponent } from '../update/cidade-update.component';
import { CidadeRoutingResolveService } from './cidade-routing-resolve.service';

const cidadeRoute: Routes = [
  {
    path: '',
    component: CidadeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CidadeDetailComponent,
    resolve: {
      cidade: CidadeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CidadeUpdateComponent,
    resolve: {
      cidade: CidadeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CidadeUpdateComponent,
    resolve: {
      cidade: CidadeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cidadeRoute)],
  exports: [RouterModule],
})
export class CidadeRoutingModule {}
