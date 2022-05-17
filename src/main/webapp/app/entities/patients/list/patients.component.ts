import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatients } from '../patients.model';
import { PatientsService } from '../service/patients.service';
import { PatientsDeleteDialogComponent } from '../delete/patients-delete-dialog.component';

@Component({
  selector: 'jhi-patients',
  templateUrl: './patients.component.html',
})
export class PatientsComponent implements OnInit {
  patients?: IPatients[];
  isLoading = false;

  constructor(protected patientsService: PatientsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.patientsService.query().subscribe({
      next: (res: HttpResponse<IPatients[]>) => {
        this.isLoading = false;
        this.patients = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPatients): number {
    return item.id!;
  }

  delete(patients: IPatients): void {
    const modalRef = this.modalService.open(PatientsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.patients = patients;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
