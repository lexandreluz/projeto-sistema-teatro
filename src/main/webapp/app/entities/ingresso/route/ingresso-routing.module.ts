import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IngressoComponent } from '../list/ingresso.component';
import { IngressoDetailComponent } from '../detail/ingresso-detail.component';
import { IngressoUpdateComponent } from '../update/ingresso-update.component';
import { IngressoRoutingResolveService } from './ingresso-routing-resolve.service';

const ingressoRoute: Routes = [
  {
    path: '',
    component: IngressoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IngressoDetailComponent,
    resolve: {
      ingresso: IngressoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IngressoUpdateComponent,
    resolve: {
      ingresso: IngressoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IngressoUpdateComponent,
    resolve: {
      ingresso: IngressoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ingressoRoute)],
  exports: [RouterModule],
})
export class IngressoRoutingModule {}
