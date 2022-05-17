import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IHospitalisations, Hospitalisations } from '../hospitalisations.model';
import { HospitalisationsService } from '../service/hospitalisations.service';
import { IChambres } from 'app/entities/chambres/chambres.model';
import { ChambresService } from 'app/entities/chambres/service/chambres.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';

@Component({
  selector: 'jhi-hospitalisations-update',
  templateUrl: './hospitalisations-update.component.html',
})
export class HospitalisationsUpdateComponent implements OnInit {
  isSaving = false;

  chambresSharedCollection: IChambres[] = [];
  patientsSharedCollection: IPatients[] = [];

  editForm = this.fb.group({
    id: [],
    dateArrivee: [],
    dateSortie: [],
    observationsHospitalisation: [],
    chambre: [],
    patient: [],
  });

  constructor(
    protected hospitalisationsService: HospitalisationsService,
    protected chambresService: ChambresService,
    protected patientsService: PatientsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hospitalisations }) => {
      if (hospitalisations.id === undefined) {
        const today = dayjs().startOf('day');
        hospitalisations.dateArrivee = today;
        hospitalisations.dateSortie = today;
      }

      this.updateForm(hospitalisations);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hospitalisations = this.createFromForm();
    if (hospitalisations.id !== undefined) {
      this.subscribeToSaveResponse(this.hospitalisationsService.update(hospitalisations));
    } else {
      this.subscribeToSaveResponse(this.hospitalisationsService.create(hospitalisations));
    }
  }

  trackChambresById(_index: number, item: IChambres): number {
    return item.id!;
  }

  trackPatientsById(_index: number, item: IPatients): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHospitalisations>>): void {
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

  protected updateForm(hospitalisations: IHospitalisations): void {
    this.editForm.patchValue({
      id: hospitalisations.id,
      dateArrivee: hospitalisations.dateArrivee ? hospitalisations.dateArrivee.format(DATE_TIME_FORMAT) : null,
      dateSortie: hospitalisations.dateSortie ? hospitalisations.dateSortie.format(DATE_TIME_FORMAT) : null,
      observationsHospitalisation: hospitalisations.observationsHospitalisation,
      chambre: hospitalisations.chambre,
      patient: hospitalisations.patient,
    });

    this.chambresSharedCollection = this.chambresService.addChambresToCollectionIfMissing(
      this.chambresSharedCollection,
      hospitalisations.chambre
    );
    this.patientsSharedCollection = this.patientsService.addPatientsToCollectionIfMissing(
      this.patientsSharedCollection,
      hospitalisations.patient
    );
  }

  protected loadRelationshipsOptions(): void {
    this.chambresService
      .query()
      .pipe(map((res: HttpResponse<IChambres[]>) => res.body ?? []))
      .pipe(
        map((chambres: IChambres[]) => this.chambresService.addChambresToCollectionIfMissing(chambres, this.editForm.get('chambre')!.value))
      )
      .subscribe((chambres: IChambres[]) => (this.chambresSharedCollection = chambres));

    this.patientsService
      .query()
      .pipe(map((res: HttpResponse<IPatients[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatients[]) => this.patientsService.addPatientsToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatients[]) => (this.patientsSharedCollection = patients));
  }

  protected createFromForm(): IHospitalisations {
    return {
      ...new Hospitalisations(),
      id: this.editForm.get(['id'])!.value,
      dateArrivee: this.editForm.get(['dateArrivee'])!.value
        ? dayjs(this.editForm.get(['dateArrivee'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dateSortie: this.editForm.get(['dateSortie'])!.value ? dayjs(this.editForm.get(['dateSortie'])!.value, DATE_TIME_FORMAT) : undefined,
      observationsHospitalisation: this.editForm.get(['observationsHospitalisation'])!.value,
      chambre: this.editForm.get(['chambre'])!.value,
      patient: this.editForm.get(['patient'])!.value,
    };
  }
}
