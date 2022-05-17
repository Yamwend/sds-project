import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExamens } from '../examens.model';
import { ExamensService } from '../service/examens.service';
import { ExamensDeleteDialogComponent } from '../delete/examens-delete-dialog.component';

@Component({
  selector: 'jhi-examens',
  templateUrl: './examens.component.html',
})
export class ExamensComponent implements OnInit {
  examens?: IExamens[];
  isLoading = false;

  constructor(protected examensService: ExamensService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.examensService.query().subscribe({
      next: (res: HttpResponse<IExamens[]>) => {
        this.isLoading = false;
        this.examens = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IExamens): number {
    return item.id!;
  }

  delete(examens: IExamens): void {
    const modalRef = this.modalService.open(ExamensDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.examens = examens;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
