import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrdonnances } from '../ordonnances.model';
import { OrdonnancesService } from '../service/ordonnances.service';
import { OrdonnancesDeleteDialogComponent } from '../delete/ordonnances-delete-dialog.component';

@Component({
  selector: 'jhi-ordonnances',
  templateUrl: './ordonnances.component.html',
})
export class OrdonnancesComponent implements OnInit {
  ordonnances?: IOrdonnances[];
  isLoading = false;

  constructor(protected ordonnancesService: OrdonnancesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ordonnancesService.query().subscribe({
      next: (res: HttpResponse<IOrdonnances[]>) => {
        this.isLoading = false;
        this.ordonnances = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IOrdonnances): number {
    return item.id!;
  }

  delete(ordonnances: IOrdonnances): void {
    const modalRef = this.modalService.open(OrdonnancesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ordonnances = ordonnances;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
