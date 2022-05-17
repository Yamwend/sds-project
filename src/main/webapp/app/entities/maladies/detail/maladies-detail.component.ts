import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMaladies } from '../maladies.model';

@Component({
  selector: 'jhi-maladies-detail',
  templateUrl: './maladies-detail.component.html',
})
export class MaladiesDetailComponent implements OnInit {
  maladies: IMaladies | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ maladies }) => {
      this.maladies = maladies;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
