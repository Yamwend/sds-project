import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatients } from '../patients.model';
import { PatientsService } from '../service/patients.service';

@Component({
  templateUrl: './patients-delete-dialog.component.html',
})
export class PatientsDeleteDialogComponent {
  patients?: IPatients;

  constructor(protected patientsService: PatientsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.patientsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
