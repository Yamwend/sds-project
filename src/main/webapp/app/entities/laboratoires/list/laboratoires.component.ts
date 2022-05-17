import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaboratoires } from '../laboratoires.model';
import { LaboratoiresService } from '../service/laboratoires.service';
import { LaboratoiresDeleteDialogComponent } from '../delete/laboratoires-delete-dialog.component';

@Component({
  selector: 'jhi-laboratoires',
  templateUrl: './laboratoires.component.html',
})
export class LaboratoiresComponent implements OnInit {
  laboratoires?: ILaboratoires[];
  isLoading = false;

  constructor(protected laboratoiresService: LaboratoiresService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.laboratoiresService.query().subscribe({
      next: (res: HttpResponse<ILaboratoires[]>) => {
        this.isLoading = false;
        this.laboratoires = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILaboratoires): number {
    return item.id!;
  }

  delete(laboratoires: ILaboratoires): void {
    const modalRef = this.modalService.open(LaboratoiresDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.laboratoires = laboratoires;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
