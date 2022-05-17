import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeExams } from '../type-exams.model';
import { TypeExamsService } from '../service/type-exams.service';

@Component({
  templateUrl: './type-exams-delete-dialog.component.html',
})
export class TypeExamsDeleteDialogComponent {
  typeExams?: ITypeExams;

  constructor(protected typeExamsService: TypeExamsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeExamsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
