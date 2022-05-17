import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITraitements } from '../traitements.model';

@Component({
  selector: 'jhi-traitements-detail',
  templateUrl: './traitements-detail.component.html',
})
export class TraitementsDetailComponent implements OnInit {
  traitements: ITraitements | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ traitements }) => {
      this.traitements = traitements;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
