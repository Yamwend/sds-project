import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITraitements } from '../traitements.model';
import { TraitementsService } from '../service/traitements.service';

@Component({
  templateUrl: './traitements-delete-dialog.component.html',
})
export class TraitementsDeleteDialogComponent {
  traitements?: ITraitements;

  constructor(protected traitementsService: TraitementsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.traitementsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
