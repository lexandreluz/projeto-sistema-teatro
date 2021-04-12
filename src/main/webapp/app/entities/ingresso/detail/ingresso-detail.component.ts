import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIngresso } from '../ingresso.model';

@Component({
  selector: 'jhi-ingresso-detail',
  templateUrl: './ingresso-detail.component.html',
})
export class IngressoDetailComponent implements OnInit {
  ingresso: IIngresso | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingresso }) => {
      this.ingresso = ingresso;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
