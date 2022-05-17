import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExamens } from '../examens.model';
import { ExamensService } from '../service/examens.service';

@Component({
  templateUrl: './examens-delete-dialog.component.html',
})
export class ExamensDeleteDialogComponent {
  examens?: IExamens;

  constructor(protected examensService: ExamensService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.examensService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
