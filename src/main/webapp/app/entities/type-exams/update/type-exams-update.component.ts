import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeExams, TypeExams } from '../type-exams.model';
import { TypeExamsService } from '../service/type-exams.service';

@Component({
  selector: 'jhi-type-exams-update',
  templateUrl: './type-exams-update.component.html',
})
export class TypeExamsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelleType: [],
    descruptionType: [],
  });

  constructor(protected typeExamsService: TypeExamsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeExams }) => {
      this.updateForm(typeExams);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeExams = this.createFromForm();
    if (typeExams.id !== undefined) {
      this.subscribeToSaveResponse(this.typeExamsService.update(typeExams));
    } else {
      this.subscribeToSaveResponse(this.typeExamsService.create(typeExams));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeExams>>): void {
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

  protected updateForm(typeExams: ITypeExams): void {
    this.editForm.patchValue({
      id: typeExams.id,
      libelleType: typeExams.libelleType,
      descruptionType: typeExams.descruptionType,
    });
  }

  protected createFromForm(): ITypeExams {
    return {
      ...new TypeExams(),
      id: this.editForm.get(['id'])!.value,
      libelleType: this.editForm.get(['libelleType'])!.value,
      descruptionType: this.editForm.get(['descruptionType'])!.value,
    };
  }
}
