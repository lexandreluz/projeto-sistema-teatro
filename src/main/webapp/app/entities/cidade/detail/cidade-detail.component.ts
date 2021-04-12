import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICidade } from '../cidade.model';

@Component({
  selector: 'jhi-cidade-detail',
  templateUrl: './cidade-detail.component.html',
})
export class CidadeDetailComponent implements OnInit {
  cidade: ICidade | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cidade }) => {
      this.cidade = cidade;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
