import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMaladies, Maladies } from '../maladies.model';
import { MaladiesService } from '../service/maladies.service';
import { IFamilleMaladies } from 'app/entities/famille-maladies/famille-maladies.model';
import { FamilleMaladiesService } from 'app/entities/famille-maladies/service/famille-maladies.service';

@Component({
  selector: 'jhi-maladies-update',
  templateUrl: './maladies-update.component.html',
})
export class MaladiesUpdateComponent implements OnInit {
  isSaving = false;

  familleMaladiesSharedCollection: IFamilleMaladies[] = [];

  editForm = this.fb.group({
    id: [],
    nomMaladie: [],
    familleMaladie: [],
    descriptionMaladie: [],
    famille: [],
  });

  constructor(
    protected maladiesService: MaladiesService,
    protected familleMaladiesService: FamilleMaladiesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ maladies }) => {
      this.updateForm(maladies);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const maladies = this.createFromForm();
    if (maladies.id !== undefined) {
      this.subscribeToSaveResponse(this.maladiesService.update(maladies));
    } else {
      this.subscribeToSaveResponse(this.maladiesService.create(maladies));
    }
  }

  trackFamilleMaladiesById(_index: number, item: IFamilleMaladies): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMaladies>>): void {
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

  protected updateForm(maladies: IMaladies): void {
    this.editForm.patchValue({
      id: maladies.id,
      nomMaladie: maladies.nomMaladie,
      familleMaladie: maladies.familleMaladie,
      descriptionMaladie: maladies.descriptionMaladie,
      famille: maladies.famille,
    });

    this.familleMaladiesSharedCollection = this.familleMaladiesService.addFamilleMaladiesToCollectionIfMissing(
      this.familleMaladiesSharedCollection,
      maladies.famille
    );
  }

  protected loadRelationshipsOptions(): void {
    this.familleMaladiesService
      .query()
      .pipe(map((res: HttpResponse<IFamilleMaladies[]>) => res.body ?? []))
      .pipe(
        map((familleMaladies: IFamilleMaladies[]) =>
          this.familleMaladiesService.addFamilleMaladiesToCollectionIfMissing(familleMaladies, this.editForm.get('famille')!.value)
        )
      )
      .subscribe((familleMaladies: IFamilleMaladies[]) => (this.familleMaladiesSharedCollection = familleMaladies));
  }

  protected createFromForm(): IMaladies {
    return {
      ...new Maladies(),
      id: this.editForm.get(['id'])!.value,
      nomMaladie: this.editForm.get(['nomMaladie'])!.value,
      familleMaladie: this.editForm.get(['familleMaladie'])!.value,
      descriptionMaladie: this.editForm.get(['descriptionMaladie'])!.value,
      famille: this.editForm.get(['famille'])!.value,
    };
  }
}
