import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventoComponent } from '../list/evento.component';
import { EventoDetailComponent } from '../detail/evento-detail.component';
import { EventoUpdateComponent } from '../update/evento-update.component';
import { EventoRoutingResolveService } from './evento-routing-resolve.service';

const eventoRoute: Routes = [
  {
    path: '',
    component: EventoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventoDetailComponent,
    resolve: {
      evento: EventoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventoUpdateComponent,
    resolve: {
      evento: EventoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventoUpdateComponent,
    resolve: {
      evento: EventoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventoRoute)],
  exports: [RouterModule],
})
export class EventoRoutingModule {}
