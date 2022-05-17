import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILaboratoires } from '../laboratoires.model';

@Component({
  selector: 'jhi-laboratoires-detail',
  templateUrl: './laboratoires-detail.component.html',
})
export class LaboratoiresDetailComponent implements OnInit {
  laboratoires: ILaboratoires | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laboratoires }) => {
      this.laboratoires = laboratoires;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
