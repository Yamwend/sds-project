import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILigneOrdonnances } from '../ligne-ordonnances.model';

@Component({
  selector: 'jhi-ligne-ordonnances-detail',
  templateUrl: './ligne-ordonnances-detail.component.html',
})
export class LigneOrdonnancesDetailComponent implements OnInit {
  ligneOrdonnances: ILigneOrdonnances | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ligneOrdonnances }) => {
      this.ligneOrdonnances = ligneOrdonnances;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
