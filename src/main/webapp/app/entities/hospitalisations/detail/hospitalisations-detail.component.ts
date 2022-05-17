import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHospitalisations } from '../hospitalisations.model';

@Component({
  selector: 'jhi-hospitalisations-detail',
  templateUrl: './hospitalisations-detail.component.html',
})
export class HospitalisationsDetailComponent implements OnInit {
  hospitalisations: IHospitalisations | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hospitalisations }) => {
      this.hospitalisations = hospitalisations;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
