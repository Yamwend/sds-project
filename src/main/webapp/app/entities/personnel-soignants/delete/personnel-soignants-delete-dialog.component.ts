import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonnelSoignants } from '../personnel-soignants.model';
import { PersonnelSoignantsService } from '../service/personnel-soignants.service';

@Component({
  templateUrl: './personnel-soignants-delete-dialog.component.html',
})
export class PersonnelSoignantsDeleteDialogComponent {
  personnelSoignants?: IPersonnelSoignants;

  constructor(protected personnelSoignantsService: PersonnelSoignantsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personnelSoignantsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
