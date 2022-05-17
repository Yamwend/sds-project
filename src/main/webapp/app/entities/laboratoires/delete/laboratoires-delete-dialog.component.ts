import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaboratoires } from '../laboratoires.model';
import { LaboratoiresService } from '../service/laboratoires.service';

@Component({
  templateUrl: './laboratoires-delete-dialog.component.html',
})
export class LaboratoiresDeleteDialogComponent {
  laboratoires?: ILaboratoires;

  constructor(protected laboratoiresService: LaboratoiresService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.laboratoiresService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
