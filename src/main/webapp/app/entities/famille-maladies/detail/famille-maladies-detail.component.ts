import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFamilleMaladies } from '../famille-maladies.model';

@Component({
  selector: 'jhi-famille-maladies-detail',
  templateUrl: './famille-maladies-detail.component.html',
})
export class FamilleMaladiesDetailComponent implements OnInit {
  familleMaladies: IFamilleMaladies | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familleMaladies }) => {
      this.familleMaladies = familleMaladies;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
