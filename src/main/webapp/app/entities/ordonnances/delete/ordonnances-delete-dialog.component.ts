import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrdonnances } from '../ordonnances.model';
import { OrdonnancesService } from '../service/ordonnances.service';

@Component({
  templateUrl: './ordonnances-delete-dialog.component.html',
})
export class OrdonnancesDeleteDialogComponent {
  ordonnances?: IOrdonnances;

  constructor(protected ordonnancesService: OrdonnancesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ordonnancesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
