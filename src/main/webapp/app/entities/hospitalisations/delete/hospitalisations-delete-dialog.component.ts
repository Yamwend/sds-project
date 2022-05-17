import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHospitalisations } from '../hospitalisations.model';
import { HospitalisationsService } from '../service/hospitalisations.service';

@Component({
  templateUrl: './hospitalisations-delete-dialog.component.html',
})
export class HospitalisationsDeleteDialogComponent {
  hospitalisations?: IHospitalisations;

  constructor(protected hospitalisationsService: HospitalisationsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.hospitalisationsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
