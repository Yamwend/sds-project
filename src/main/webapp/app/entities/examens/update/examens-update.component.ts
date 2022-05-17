import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IExamens, Examens } from '../examens.model';
import { ExamensService } from '../service/examens.service';
import { ITypeExams } from 'app/entities/type-exams/type-exams.model';
import { TypeExamsService } from 'app/entities/type-exams/service/type-exams.service';
import { ILaboratoires } from 'app/entities/laboratoires/laboratoires.model';
import { LaboratoiresService } from 'app/entities/laboratoires/service/laboratoires.service';

@Component({
  selector: 'jhi-examens-update',
  templateUrl: './examens-update.component.html',
})
export class ExamensUpdateComponent implements OnInit {
  isSaving = false;

  typeExamsSharedCollection: ITypeExams[] = [];
  laboratoiresSharedCollection: ILaboratoires[] = [];

  editForm = this.fb.group({
    id: [],
    nomExamen: [],
    typeExamen: [],
    dateExamen: [],
    typeExam: [],
    laboratoire: [],
  });

  constructor(
    protected examensService: ExamensService,
    protected typeExamsService: TypeExamsService,
    protected laboratoiresService: LaboratoiresService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examens }) => {
      if (examens.id === undefined) {
        const today = dayjs().startOf('day');
        examens.dateExamen = today;
      }

      this.updateForm(examens);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const examens = this.createFromForm();
    if (examens.id !== undefined) {
      this.subscribeToSaveResponse(this.examensService.update(examens));
    } else {
      this.subscribeToSaveResponse(this.examensService.create(examens));
    }
  }

  trackTypeExamsById(_index: number, item: ITypeExams): number {
    return item.id!;
  }

  trackLaboratoiresById(_index: number, item: ILaboratoires): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExamens>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(examens: IExamens): void {
    this.editForm.patchValue({
      id: examens.id,
      nomExamen: examens.nomExamen,
      typeExamen: examens.typeExamen,
      dateExamen: examens.dateExamen ? examens.dateExamen.format(DATE_TIME_FORMAT) : null,
      typeExam: examens.typeExam,
      laboratoire: examens.laboratoire,
    });

    this.typeExamsSharedCollection = this.typeExamsService.addTypeExamsToCollectionIfMissing(
      this.typeExamsSharedCollection,
      examens.typeExam
    );
    this.laboratoiresSharedCollection = this.laboratoiresService.addLaboratoiresToCollectionIfMissing(
      this.laboratoiresSharedCollection,
      examens.laboratoire
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeExamsService
      .query()
      .pipe(map((res: HttpResponse<ITypeExams[]>) => res.body ?? []))
      .pipe(
        map((typeExams: ITypeExams[]) =>
          this.typeExamsService.addTypeExamsToCollectionIfMissing(typeExams, this.editForm.get('typeExam')!.value)
        )
      )
      .subscribe((typeExams: ITypeExams[]) => (this.typeExamsSharedCollection = typeExams));

    this.laboratoiresService
      .query()
      .pipe(map((res: HttpResponse<ILaboratoires[]>) => res.body ?? []))
      .pipe(
        map((laboratoires: ILaboratoires[]) =>
          this.laboratoiresService.addLaboratoiresToCollectionIfMissing(laboratoires, this.editForm.get('laboratoire')!.value)
        )
      )
      .subscribe((laboratoires: ILaboratoires[]) => (this.laboratoiresSharedCollection = laboratoires));
  }

  protected createFromForm(): IExamens {
    return {
      ...new Examens(),
      id: this.editForm.get(['id'])!.value,
      nomExamen: this.editForm.get(['nomExamen'])!.value,
      typeExamen: this.editForm.get(['typeExamen'])!.value,
      dateExamen: this.editForm.get(['dateExamen'])!.value ? dayjs(this.editForm.get(['dateExamen'])!.value, DATE_TIME_FORMAT) : undefined,
      typeExam: this.editForm.get(['typeExam'])!.value,
      laboratoire: this.editForm.get(['laboratoire'])!.value,
    };
  }
}
