import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IOrdonnances, Ordonnances } from '../ordonnances.model';
import { OrdonnancesService } from '../service/ordonnances.service';

@Component({
  selector: 'jhi-ordonnances-update',
  templateUrl: './ordonnances-update.component.html',
})
export class OrdonnancesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    numero: [],
  });

  constructor(protected ordonnancesService: OrdonnancesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordonnances }) => {
      this.updateForm(ordonnances);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ordonnances = this.createFromForm();
    if (ordonnances.id !== undefined) {
      this.subscribeToSaveResponse(this.ordonnancesService.update(ordonnances));
    } else {
      this.subscribeToSaveResponse(this.ordonnancesService.create(ordonnances));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrdonnances>>): void {
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

  protected updateForm(ordonnances: IOrdonnances): void {
    this.editForm.patchValue({
      id: ordonnances.id,
      numero: ordonnances.numero,
    });
  }

  protected createFromForm(): IOrdonnances {
    return {
      ...new Ordonnances(),
      id: this.editForm.get(['id'])!.value,
      numero: this.editForm.get(['numero'])!.value,
    };
  }
}
