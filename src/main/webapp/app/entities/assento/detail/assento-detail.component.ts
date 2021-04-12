import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAssento } from '../assento.model';

@Component({
  selector: 'jhi-assento-detail',
  templateUrl: './assento-detail.component.html',
})
export class AssentoDetailComponent implements OnInit {
  assento: IAssento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assento }) => {
      this.assento = assento;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
