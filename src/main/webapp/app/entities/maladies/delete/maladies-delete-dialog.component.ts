import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMaladies } from '../maladies.model';
import { MaladiesService } from '../service/maladies.service';

@Component({
  templateUrl: './maladies-delete-dialog.component.html',
})
export class MaladiesDeleteDialogComponent {
  maladies?: IMaladies;

  constructor(protected maladiesService: MaladiesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.maladiesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
