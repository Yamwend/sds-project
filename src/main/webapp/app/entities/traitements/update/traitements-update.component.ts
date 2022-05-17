import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITraitements, Traitements } from '../traitements.model';
import { TraitementsService } from '../service/traitements.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { IMaladies } from 'app/entities/maladies/maladies.model';
import { MaladiesService } from 'app/entities/maladies/service/maladies.service';
import { IOrdonnances } from 'app/entities/ordonnances/ordonnances.model';
import { OrdonnancesService } from 'app/entities/ordonnances/service/ordonnances.service';
import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';
import { PersonnelSoignantsService } from 'app/entities/personnel-soignants/service/personnel-soignants.service';

@Component({
  selector: 'jhi-traitements-update',
  templateUrl: './traitements-update.component.html',
})
export class TraitementsUpdateComponent implements OnInit {
  isSaving = false;

  patientsSharedCollection: IPatients[] = [];
  maladiesSharedCollection: IMaladies[] = [];
  ordonnancesSharedCollection: IOrdonnances[] = [];
  personnelSoignantsSharedCollection: IPersonnelSoignants[] = [];

  editForm = this.fb.group({
    id: [],
    observationsTraitement: [],
    debutTraitement: [],
    finTraitement: [],
    etatFinPatient: [],
    patient: [],
    maladie: [],
    ordonnance: [],
    personnel: [],
  });

  constructor(
    protected traitementsService: TraitementsService,
    protected patientsService: PatientsService,
    protected maladiesService: MaladiesService,
    protected ordonnancesService: OrdonnancesService,
    protected personnelSoignantsService: PersonnelSoignantsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ traitements }) => {
      if (traitements.id === undefined) {
        const today = dayjs().startOf('day');
        traitements.debutTraitement = today;
        traitements.finTraitement = today;
      }

      this.updateForm(traitements);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const traitements = this.createFromForm();
    if (traitements.id !== undefined) {
      this.subscribeToSaveResponse(this.traitementsService.update(traitements));
    } else {
      this.subscribeToSaveResponse(this.traitementsService.create(traitements));
    }
  }

  trackPatientsById(_index: number, item: IPatients): number {
    return item.id!;
  }

  trackMaladiesById(_index: number, item: IMaladies): number {
    return item.id!;
  }

  trackOrdonnancesById(_index: number, item: IOrdonnances): number {
    return item.id!;
  }

  trackPersonnelSoignantsById(_index: number, item: IPersonnelSoignants): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITraitements>>): void {
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

  protected updateForm(traitements: ITraitements): void {
    this.editForm.patchValue({
      id: traitements.id,
      observationsTraitement: traitements.observationsTraitement,
      debutTraitement: traitements.debutTraitement ? traitements.debutTraitement.format(DATE_TIME_FORMAT) : null,
      finTraitement: traitements.finTraitement ? traitements.finTraitement.format(DATE_TIME_FORMAT) : null,
      etatFinPatient: traitements.etatFinPatient,
      patient: traitements.patient,
      maladie: traitements.maladie,
      ordonnance: traitements.ordonnance,
      personnel: traitements.personnel,
    });

    this.patientsSharedCollection = this.patientsService.addPatientsToCollectionIfMissing(
      this.patientsSharedCollection,
      traitements.patient
    );
    this.maladiesSharedCollection = this.maladiesService.addMaladiesToCollectionIfMissing(
      this.maladiesSharedCollection,
      traitements.maladie
    );
    this.ordonnancesSharedCollection = this.ordonnancesService.addOrdonnancesToCollectionIfMissing(
      this.ordonnancesSharedCollection,
      traitements.ordonnance
    );
    this.personnelSoignantsSharedCollection = this.personnelSoignantsService.addPersonnelSoignantsToCollectionIfMissing(
      this.personnelSoignantsSharedCollection,
      traitements.personnel
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientsService
      .query()
      .pipe(map((res: HttpResponse<IPatients[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatients[]) => this.patientsService.addPatientsToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatients[]) => (this.patientsSharedCollection = patients));

    this.maladiesService
      .query()
      .pipe(map((res: HttpResponse<IMaladies[]>) => res.body ?? []))
      .pipe(
        map((maladies: IMaladies[]) => this.maladiesService.addMaladiesToCollectionIfMissing(maladies, this.editForm.get('maladie')!.value))
      )
      .subscribe((maladies: IMaladies[]) => (this.maladiesSharedCollection = maladies));

    this.ordonnancesService
      .query()
      .pipe(map((res: HttpResponse<IOrdonnances[]>) => res.body ?? []))
      .pipe(
        map((ordonnances: IOrdonnances[]) =>
          this.ordonnancesService.addOrdonnancesToCollectionIfMissing(ordonnances, this.editForm.get('ordonnance')!.value)
        )
      )
      .subscribe((ordonnances: IOrdonnances[]) => (this.ordonnancesSharedCollection = ordonnances));

    this.personnelSoignantsService
      .query()
      .pipe(map((res: HttpResponse<IPersonnelSoignants[]>) => res.body ?? []))
      .pipe(
        map((personnelSoignants: IPersonnelSoignants[]) =>
          this.personnelSoignantsService.addPersonnelSoignantsToCollectionIfMissing(
            personnelSoignants,
            this.editForm.get('personnel')!.value
          )
        )
      )
      .subscribe((personnelSoignants: IPersonnelSoignants[]) => (this.personnelSoignantsSharedCollection = personnelSoignants));
  }

  protected createFromForm(): ITraitements {
    return {
      ...new Traitements(),
      id: this.editForm.get(['id'])!.value,
      observationsTraitement: this.editForm.get(['observationsTraitement'])!.value,
      debutTraitement: this.editForm.get(['debutTraitement'])!.value
        ? dayjs(this.editForm.get(['debutTraitement'])!.value, DATE_TIME_FORMAT)
        : undefined,
      finTraitement: this.editForm.get(['finTraitement'])!.value
        ? dayjs(this.editForm.get(['finTraitement'])!.value, DATE_TIME_FORMAT)
        : undefined,
      etatFinPatient: this.editForm.get(['etatFinPatient'])!.value,
      patient: this.editForm.get(['patient'])!.value,
      maladie: this.editForm.get(['maladie'])!.value,
      ordonnance: this.editForm.get(['ordonnance'])!.value,
      personnel: this.editForm.get(['personnel'])!.value,
    };
  }
}
