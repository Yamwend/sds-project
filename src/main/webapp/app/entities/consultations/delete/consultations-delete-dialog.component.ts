import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsultations } from '../consultations.model';
import { ConsultationsService } from '../service/consultations.service';

@Component({
  templateUrl: './consultations-delete-dialog.component.html',
})
export class ConsultationsDeleteDialogComponent {
  consultations?: IConsultations;

  constructor(protected consultationsService: ConsultationsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.consultationsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
