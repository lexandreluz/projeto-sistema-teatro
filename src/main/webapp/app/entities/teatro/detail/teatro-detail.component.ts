import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeatro } from '../teatro.model';

@Component({
  selector: 'jhi-teatro-detail',
  templateUrl: './teatro-detail.component.html',
})
export class TeatroDetailComponent implements OnInit {
  teatro: ITeatro | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teatro }) => {
      this.teatro = teatro;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
