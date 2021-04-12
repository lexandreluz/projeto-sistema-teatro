import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ingresso',
        data: { pageTitle: 'sistemaTeatroApp.ingresso.home.title' },
        loadChildren: () => import('./ingresso/ingresso.module').then(m => m.IngressoModule),
      },
      {
        path: 'assento',
        data: { pageTitle: 'sistemaTeatroApp.assento.home.title' },
        loadChildren: () => import('./assento/assento.module').then(m => m.AssentoModule),
      },
      {
        path: 'cidade',
        data: { pageTitle: 'sistemaTeatroApp.cidade.home.title' },
        loadChildren: () => import('./cidade/cidade.module').then(m => m.CidadeModule),
      },
      {
        path: 'usuario',
        data: { pageTitle: 'sistemaTeatroApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'evento',
        data: { pageTitle: 'sistemaTeatroApp.evento.home.title' },
        loadChildren: () => import('./evento/evento.module').then(m => m.EventoModule),
      },
      {
        path: 'teatro',
        data: { pageTitle: 'sistemaTeatroApp.teatro.home.title' },
        loadChildren: () => import('./teatro/teatro.module').then(m => m.TeatroModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
