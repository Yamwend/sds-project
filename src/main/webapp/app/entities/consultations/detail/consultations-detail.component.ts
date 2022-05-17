import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConsultations } from '../consultations.model';

@Component({
  selector: 'jhi-consultations-detail',
  templateUrl: './consultations-detail.component.html',
})
export class ConsultationsDetailComponent implements OnInit {
  consultations: IConsultations | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultations }) => {
      this.consultations = consultations;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
