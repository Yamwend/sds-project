import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeExams } from '../type-exams.model';
import { TypeExamsService } from '../service/type-exams.service';
import { TypeExamsDeleteDialogComponent } from '../delete/type-exams-delete-dialog.component';

@Component({
  selector: 'jhi-type-exams',
  templateUrl: './type-exams.component.html',
})
export class TypeExamsComponent implements OnInit {
  typeExams?: ITypeExams[];
  isLoading = false;

  constructor(protected typeExamsService: TypeExamsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.typeExamsService.query().subscribe({
      next: (res: HttpResponse<ITypeExams[]>) => {
        this.isLoading = false;
        this.typeExams = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITypeExams): number {
    return item.id!;
  }

  delete(typeExams: ITypeExams): void {
    const modalRef = this.modalService.open(TypeExamsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeExams = typeExams;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
