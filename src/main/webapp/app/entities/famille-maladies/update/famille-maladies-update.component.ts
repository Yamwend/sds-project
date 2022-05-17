import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFamilleMaladies, FamilleMaladies } from '../famille-maladies.model';
import { FamilleMaladiesService } from '../service/famille-maladies.service';

@Component({
  selector: 'jhi-famille-maladies-update',
  templateUrl: './famille-maladies-update.component.html',
})
export class FamilleMaladiesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelleFMaladie: [],
    descriptionFMaladie: [],
  });

  constructor(
    protected familleMaladiesService: FamilleMaladiesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familleMaladies }) => {
      this.updateForm(familleMaladies);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const familleMaladies = this.createFromForm();
    if (familleMaladies.id !== undefined) {
      this.subscribeToSaveResponse(this.familleMaladiesService.update(familleMaladies));
    } else {
      this.subscribeToSaveResponse(this.familleMaladiesService.create(familleMaladies));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFamilleMaladies>>): void {
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

  protected updateForm(familleMaladies: IFamilleMaladies): void {
    this.editForm.patchValue({
      id: familleMaladies.id,
      libelleFMaladie: familleMaladies.libelleFMaladie,
      descriptionFMaladie: familleMaladies.descriptionFMaladie,
    });
  }

  protected createFromForm(): IFamilleMaladies {
    return {
      ...new FamilleMaladies(),
      id: this.editForm.get(['id'])!.value,
      libelleFMaladie: this.editForm.get(['libelleFMaladie'])!.value,
      descriptionFMaladie: this.editForm.get(['descriptionFMaladie'])!.value,
    };
  }
}
