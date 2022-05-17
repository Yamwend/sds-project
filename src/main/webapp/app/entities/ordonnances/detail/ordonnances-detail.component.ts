import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrdonnances } from '../ordonnances.model';

@Component({
  selector: 'jhi-ordonnances-detail',
  templateUrl: './ordonnances-detail.component.html',
})
export class OrdonnancesDetailComponent implements OnInit {
  ordonnances: IOrdonnances | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordonnances }) => {
      this.ordonnances = ordonnances;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
