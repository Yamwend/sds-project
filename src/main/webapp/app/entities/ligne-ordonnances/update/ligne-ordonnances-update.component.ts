import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILigneOrdonnances, LigneOrdonnances } from '../ligne-ordonnances.model';
import { LigneOrdonnancesService } from '../service/ligne-ordonnances.service';
import { IOrdonnances } from 'app/entities/ordonnances/ordonnances.model';
import { OrdonnancesService } from 'app/entities/ordonnances/service/ordonnances.service';

@Component({
  selector: 'jhi-ligne-ordonnances-update',
  templateUrl: './ligne-ordonnances-update.component.html',
})
export class LigneOrdonnancesUpdateComponent implements OnInit {
  isSaving = false;

  ordonnancesSharedCollection: IOrdonnances[] = [];

  editForm = this.fb.group({
    id: [],
    medicament: [],
    posologie: [],
    ordonnance: [],
  });

  constructor(
    protected ligneOrdonnancesService: LigneOrdonnancesService,
    protected ordonnancesService: OrdonnancesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ligneOrdonnances }) => {
      this.updateForm(ligneOrdonnances);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ligneOrdonnances = this.createFromForm();
    if (ligneOrdonnances.id !== undefined) {
      this.subscribeToSaveResponse(this.ligneOrdonnancesService.update(ligneOrdonnances));
    } else {
      this.subscribeToSaveResponse(this.ligneOrdonnancesService.create(ligneOrdonnances));
    }
  }

  trackOrdonnancesById(_index: number, item: IOrdonnances): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILigneOrdonnances>>): void {
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

  protected updateForm(ligneOrdonnances: ILigneOrdonnances): void {
    this.editForm.patchValue({
      id: ligneOrdonnances.id,
      medicament: ligneOrdonnances.medicament,
      posologie: ligneOrdonnances.posologie,
      ordonnance: ligneOrdonnances.ordonnance,
    });

    this.ordonnancesSharedCollection = this.ordonnancesService.addOrdonnancesToCollectionIfMissing(
      this.ordonnancesSharedCollection,
      ligneOrdonnances.ordonnance
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ordonnancesService
      .query()
      .pipe(map((res: HttpResponse<IOrdonnances[]>) => res.body ?? []))
      .pipe(
        map((ordonnances: IOrdonnances[]) =>
          this.ordonnancesService.addOrdonnancesToCollectionIfMissing(ordonnances, this.editForm.get('ordonnance')!.value)
        )
      )
      .subscribe((ordonnances: IOrdonnances[]) => (this.ordonnancesSharedCollection = ordonnances));
  }

  protected createFromForm(): ILigneOrdonnances {
    return {
      ...new LigneOrdonnances(),
      id: this.editForm.get(['id'])!.value,
      medicament: this.editForm.get(['medicament'])!.value,
      posologie: this.editForm.get(['posologie'])!.value,
      ordonnance: this.editForm.get(['ordonnance'])!.value,
    };
  }
}
