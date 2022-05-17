import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFamilleMaladies } from '../famille-maladies.model';
import { FamilleMaladiesService } from '../service/famille-maladies.service';

@Component({
  templateUrl: './famille-maladies-delete-dialog.component.html',
})
export class FamilleMaladiesDeleteDialogComponent {
  familleMaladies?: IFamilleMaladies;

  constructor(protected familleMaladiesService: FamilleMaladiesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.familleMaladiesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
