import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExamens } from '../examens.model';

@Component({
  selector: 'jhi-examens-detail',
  templateUrl: './examens-detail.component.html',
})
export class ExamensDetailComponent implements OnInit {
  examens: IExamens | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examens }) => {
      this.examens = examens;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
