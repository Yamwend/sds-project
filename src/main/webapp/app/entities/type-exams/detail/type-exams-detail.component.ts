import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeExams } from '../type-exams.model';

@Component({
  selector: 'jhi-type-exams-detail',
  templateUrl: './type-exams-detail.component.html',
})
export class TypeExamsDetailComponent implements OnInit {
  typeExams: ITypeExams | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeExams }) => {
      this.typeExams = typeExams;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
