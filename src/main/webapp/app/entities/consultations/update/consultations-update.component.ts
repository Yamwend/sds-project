import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IConsultations, Consultations } from '../consultations.model';
import { ConsultationsService } from '../service/consultations.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';
import { PersonnelSoignantsService } from 'app/entities/personnel-soignants/service/personnel-soignants.service';
import { IExamens } from 'app/entities/examens/examens.model';
import { ExamensService } from 'app/entities/examens/service/examens.service';
import { TypeConsultation } from 'app/entities/enumerations/type-consultation.model';

@Component({
  selector: 'jhi-consultations-update',
  templateUrl: './consultations-update.component.html',
})
export class ConsultationsUpdateComponent implements OnInit {
  isSaving = false;
  typeConsultationValues = Object.keys(TypeConsultation);

  patientsSharedCollection: IPatients[] = [];
  personnelSoignantsSharedCollection: IPersonnelSoignants[] = [];
  examensSharedCollection: IExamens[] = [];

  editForm = this.fb.group({
    id: [],
    typeConsultation: [],
    observationsConsltation: [],
    fraisConsultion: [],
    dateConsultion: [],
    patient: [],
    personnel: [],
    examen: [],
  });

  constructor(
    protected consultationsService: ConsultationsService,
    protected patientsService: PatientsService,
    protected personnelSoignantsService: PersonnelSoignantsService,
    protected examensService: ExamensService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultations }) => {
      if (consultations.id === undefined) {
        const today = dayjs().startOf('day');
        consultations.dateConsultion = today;
      }

      this.updateForm(consultations);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consultations = this.createFromForm();
    if (consultations.id !== undefined) {
      this.subscribeToSaveResponse(this.consultationsService.update(consultations));
    } else {
      this.subscribeToSaveResponse(this.consultationsService.create(consultations));
    }
  }

  trackPatientsById(_index: number, item: IPatients): number {
    return item.id!;
  }

  trackPersonnelSoignantsById(_index: number, item: IPersonnelSoignants): number {
    return item.id!;
  }

  trackExamensById(_index: number, item: IExamens): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsultations>>): void {
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

  protected updateForm(consultations: IConsultations): void {
    this.editForm.patchValue({
      id: consultations.id,
      typeConsultation: consultations.typeConsultation,
      observationsConsltation: consultations.observationsConsltation,
      fraisConsultion: consultations.fraisConsultion,
      dateConsultion: consultations.dateConsultion ? consultations.dateConsultion.format(DATE_TIME_FORMAT) : null,
      patient: consultations.patient,
      personnel: consultations.personnel,
      examen: consultations.examen,
    });

    this.patientsSharedCollection = this.patientsService.addPatientsToCollectionIfMissing(
      this.patientsSharedCollection,
      consultations.patient
    );
    this.personnelSoignantsSharedCollection = this.personnelSoignantsService.addPersonnelSoignantsToCollectionIfMissing(
      this.personnelSoignantsSharedCollection,
      consultations.personnel
    );
    this.examensSharedCollection = this.examensService.addExamensToCollectionIfMissing(this.examensSharedCollection, consultations.examen);
  }

  protected loadRelationshipsOptions(): void {
    this.patientsService
      .query()
      .pipe(map((res: HttpResponse<IPatients[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatients[]) => this.patientsService.addPatientsToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatients[]) => (this.patientsSharedCollection = patients));

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

    this.examensService
      .query()
      .pipe(map((res: HttpResponse<IExamens[]>) => res.body ?? []))
      .pipe(map((examens: IExamens[]) => this.examensService.addExamensToCollectionIfMissing(examens, this.editForm.get('examen')!.value)))
      .subscribe((examens: IExamens[]) => (this.examensSharedCollection = examens));
  }

  protected createFromForm(): IConsultations {
    return {
      ...new Consultations(),
      id: this.editForm.get(['id'])!.value,
      typeConsultation: this.editForm.get(['typeConsultation'])!.value,
      observationsConsltation: this.editForm.get(['observationsConsltation'])!.value,
      fraisConsultion: this.editForm.get(['fraisConsultion'])!.value,
      dateConsultion: this.editForm.get(['dateConsultion'])!.value
        ? dayjs(this.editForm.get(['dateConsultion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      patient: this.editForm.get(['patient'])!.value,
      personnel: this.editForm.get(['personnel'])!.value,
      examen: this.editForm.get(['examen'])!.value,
    };
  }
}
