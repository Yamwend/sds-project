import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILaboratoires, Laboratoires } from '../laboratoires.model';
import { LaboratoiresService } from '../service/laboratoires.service';

@Component({
  selector: 'jhi-laboratoires-update',
  templateUrl: './laboratoires-update.component.html',
})
export class LaboratoiresUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nomLaboratoire: [],
    observationsExamens: [],
  });

  constructor(protected laboratoiresService: LaboratoiresService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laboratoires }) => {
      this.updateForm(laboratoires);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const laboratoires = this.createFromForm();
    if (laboratoires.id !== undefined) {
      this.subscribeToSaveResponse(this.laboratoiresService.update(laboratoires));
    } else {
      this.subscribeToSaveResponse(this.laboratoiresService.create(laboratoires));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILaboratoires>>): void {
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

  protected updateForm(laboratoires: ILaboratoires): void {
    this.editForm.patchValue({
      id: laboratoires.id,
      nomLaboratoire: laboratoires.nomLaboratoire,
      observationsExamens: laboratoires.observationsExamens,
    });
  }

  protected createFromForm(): ILaboratoires {
    return {
      ...new Laboratoires(),
      id: this.editForm.get(['id'])!.value,
      nomLaboratoire: this.editForm.get(['nomLaboratoire'])!.value,
      observationsExamens: this.editForm.get(['observationsExamens'])!.value,
    };
  }
}
