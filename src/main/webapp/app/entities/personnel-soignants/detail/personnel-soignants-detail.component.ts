import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPersonnelSoignants } from '../personnel-soignants.model';

@Component({
  selector: 'jhi-personnel-soignants-detail',
  templateUrl: './personnel-soignants-detail.component.html',
})
export class PersonnelSoignantsDetailComponent implements OnInit {
  personnelSoignants: IPersonnelSoignants | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personnelSoignants }) => {
      this.personnelSoignants = personnelSoignants;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
