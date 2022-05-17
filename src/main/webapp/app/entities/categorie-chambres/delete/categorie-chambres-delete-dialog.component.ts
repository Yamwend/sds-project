import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategorieChambres } from '../categorie-chambres.model';
import { CategorieChambresService } from '../service/categorie-chambres.service';

@Component({
  templateUrl: './categorie-chambres-delete-dialog.component.html',
})
export class CategorieChambresDeleteDialogComponent {
  categorieChambres?: ICategorieChambres;

  constructor(protected categorieChambresService: CategorieChambresService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categorieChambresService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
