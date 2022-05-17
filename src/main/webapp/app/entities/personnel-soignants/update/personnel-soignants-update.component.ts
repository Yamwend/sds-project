import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPersonnelSoignants, PersonnelSoignants } from '../personnel-soignants.model';
import { PersonnelSoignantsService } from '../service/personnel-soignants.service';
import { IServices } from 'app/entities/services/services.model';
import { ServicesService } from 'app/entities/services/service/services.service';
import { Grade } from 'app/entities/enumerations/grade.model';
import { Sexe } from 'app/entities/enumerations/sexe.model';

@Component({
  selector: 'jhi-personnel-soignants-update',
  templateUrl: './personnel-soignants-update.component.html',
})
export class PersonnelSoignantsUpdateComponent implements OnInit {
  isSaving = false;
  gradeValues = Object.keys(Grade);
  sexeValues = Object.keys(Sexe);

  servicesSharedCollection: IServices[] = [];

  editForm = this.fb.group({
    id: [],
    codePersonne: [],
    nomPersonne: [],
    prenomPersonne: [],
    gradePersonne: [],
    fonctionPersonne: [],
    telphonePersonne: [],
    emailPersonne: [],
    adressePersonne: [],
    dateDeNaissPersonne: [],
    service: [],
  });

  constructor(
    protected personnelSoignantsService: PersonnelSoignantsService,
    protected servicesService: ServicesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personnelSoignants }) => {
      if (personnelSoignants.id === undefined) {
        const today = dayjs().startOf('day');
        personnelSoignants.dateDeNaissPersonne = today;
      }

      this.updateForm(personnelSoignants);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const personnelSoignants = this.createFromForm();
    if (personnelSoignants.id !== undefined) {
      this.subscribeToSaveResponse(this.personnelSoignantsService.update(personnelSoignants));
    } else {
      this.subscribeToSaveResponse(this.personnelSoignantsService.create(personnelSoignants));
    }
  }

  trackServicesById(_index: number, item: IServices): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonnelSoignants>>): void {
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

  protected updateForm(personnelSoignants: IPersonnelSoignants): void {
    this.editForm.patchValue({
      id: personnelSoignants.id,
      codePersonne: personnelSoignants.codePersonne,
      nomPersonne: personnelSoignants.nomPersonne,
      prenomPersonne: personnelSoignants.prenomPersonne,
      gradePersonne: personnelSoignants.gradePersonne,
      fonctionPersonne: personnelSoignants.fonctionPersonne,
      telphonePersonne: personnelSoignants.telphonePersonne,
      emailPersonne: personnelSoignants.emailPersonne,
      adressePersonne: personnelSoignants.adressePersonne,
      dateDeNaissPersonne: personnelSoignants.dateDeNaissPersonne ? personnelSoignants.dateDeNaissPersonne.format(DATE_TIME_FORMAT) : null,
      service: personnelSoignants.service,
    });

    this.servicesSharedCollection = this.servicesService.addServicesToCollectionIfMissing(
      this.servicesSharedCollection,
      personnelSoignants.service
    );
  }

  protected loadRelationshipsOptions(): void {
    this.servicesService
      .query()
      .pipe(map((res: HttpResponse<IServices[]>) => res.body ?? []))
      .pipe(
        map((services: IServices[]) => this.servicesService.addServicesToCollectionIfMissing(services, this.editForm.get('service')!.value))
      )
      .subscribe((services: IServices[]) => (this.servicesSharedCollection = services));
  }

  protected createFromForm(): IPersonnelSoignants {
    return {
      ...new PersonnelSoignants(),
      id: this.editForm.get(['id'])!.value,
      codePersonne: this.editForm.get(['codePersonne'])!.value,
      nomPersonne: this.editForm.get(['nomPersonne'])!.value,
      prenomPersonne: this.editForm.get(['prenomPersonne'])!.value,
      gradePersonne: this.editForm.get(['gradePersonne'])!.value,
      fonctionPersonne: this.editForm.get(['fonctionPersonne'])!.value,
      telphonePersonne: this.editForm.get(['telphonePersonne'])!.value,
      emailPersonne: this.editForm.get(['emailPersonne'])!.value,
      adressePersonne: this.editForm.get(['adressePersonne'])!.value,
      dateDeNaissPersonne: this.editForm.get(['dateDeNaissPersonne'])!.value
        ? dayjs(this.editForm.get(['dateDeNaissPersonne'])!.value, DATE_TIME_FORMAT)
        : undefined,
      service: this.editForm.get(['service'])!.value,
    };
  }
}
