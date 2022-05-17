import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChambres } from '../chambres.model';
import { ChambresService } from '../service/chambres.service';

@Component({
  templateUrl: './chambres-delete-dialog.component.html',
})
export class ChambresDeleteDialogComponent {
  chambres?: IChambres;

  constructor(protected chambresService: ChambresService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chambresService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
