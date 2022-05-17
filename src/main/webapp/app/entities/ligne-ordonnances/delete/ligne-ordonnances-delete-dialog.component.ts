import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILigneOrdonnances } from '../ligne-ordonnances.model';
import { LigneOrdonnancesService } from '../service/ligne-ordonnances.service';

@Component({
  templateUrl: './ligne-ordonnances-delete-dialog.component.html',
})
export class LigneOrdonnancesDeleteDialogComponent {
  ligneOrdonnances?: ILigneOrdonnances;

  constructor(protected ligneOrdonnancesService: LigneOrdonnancesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ligneOrdonnancesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
