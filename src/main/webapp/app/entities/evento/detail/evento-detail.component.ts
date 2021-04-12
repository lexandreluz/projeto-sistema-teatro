import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvento } from '../evento.model';

@Component({
  selector: 'jhi-evento-detail',
  templateUrl: './evento-detail.component.html',
})
export class EventoDetailComponent implements OnInit {
  evento: IEvento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ evento }) => {
      this.evento = evento;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
