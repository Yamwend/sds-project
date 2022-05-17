import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPatients, Patients } from '../patients.model';
import { PatientsService } from '../service/patients.service';
import { Sexe } from 'app/entities/enumerations/sexe.model';

@Component({
  selector: 'jhi-patients-update',
  templateUrl: './patients-update.component.html',
})
export class PatientsUpdateComponent implements OnInit {
  isSaving = false;
  sexeValues = Object.keys(Sexe);

  editForm = this.fb.group({
    id: [],
    codePat: [],
    nomPat: [],
    prenomPat: [],
    sexePat: [],
    adressePat: [],
    telephonePat: [],
    emailPat: [],
    originePat: [],
    professionPat: [],
    agePat: [],
  });

  constructor(protected patientsService: PatientsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patients }) => {
      if (patients.id === undefined) {
        const today = dayjs().startOf('day');
        patients.agePat = today;
      }

      this.updateForm(patients);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patients = this.createFromForm();
    if (patients.id !== undefined) {
      this.subscribeToSaveResponse(this.patientsService.update(patients));
    } else {
      this.subscribeToSaveResponse(this.patientsService.create(patients));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatients>>): void {
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

  protected updateForm(patients: IPatients): void {
    this.editForm.patchValue({
      id: patients.id,
      codePat: patients.codePat,
      nomPat: patients.nomPat,
      prenomPat: patients.prenomPat,
      sexePat: patients.sexePat,
      adressePat: patients.adressePat,
      telephonePat: patients.telephonePat,
      emailPat: patients.emailPat,
      originePat: patients.originePat,
      professionPat: patients.professionPat,
      agePat: patients.agePat ? patients.agePat.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IPatients {
    return {
      ...new Patients(),
      id: this.editForm.get(['id'])!.value,
      codePat: this.editForm.get(['codePat'])!.value,
      nomPat: this.editForm.get(['nomPat'])!.value,
      prenomPat: this.editForm.get(['prenomPat'])!.value,
      sexePat: this.editForm.get(['sexePat'])!.value,
      adressePat: this.editForm.get(['adressePat'])!.value,
      telephonePat: this.editForm.get(['telephonePat'])!.value,
      emailPat: this.editForm.get(['emailPat'])!.value,
      originePat: this.editForm.get(['originePat'])!.value,
      professionPat: this.editForm.get(['professionPat'])!.value,
      agePat: this.editForm.get(['agePat'])!.value ? dayjs(this.editForm.get(['agePat'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
