import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsultations } from '../consultations.model';
import { ConsultationsService } from '../service/consultations.service';
import { ConsultationsDeleteDialogComponent } from '../delete/consultations-delete-dialog.component';

@Component({
  selector: 'jhi-consultations',
  templateUrl: './consultations.component.html',
})
export class ConsultationsComponent implements OnInit {
  consultations?: IConsultations[];
  isLoading = false;

  constructor(protected consultationsService: ConsultationsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.consultationsService.query().subscribe({
      next: (res: HttpResponse<IConsultations[]>) => {
        this.isLoading = false;
        this.consultations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IConsultations): number {
    return item.id!;
  }

  delete(consultations: IConsultations): void {
    const modalRef = this.modalService.open(ConsultationsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.consultations = consultations;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
