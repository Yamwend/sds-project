import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITraitements } from '../traitements.model';
import { TraitementsService } from '../service/traitements.service';
import { TraitementsDeleteDialogComponent } from '../delete/traitements-delete-dialog.component';

@Component({
  selector: 'jhi-traitements',
  templateUrl: './traitements.component.html',
})
export class TraitementsComponent implements OnInit {
  traitements?: ITraitements[];
  isLoading = false;

  constructor(protected traitementsService: TraitementsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.traitementsService.query().subscribe({
      next: (res: HttpResponse<ITraitements[]>) => {
        this.isLoading = false;
        this.traitements = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITraitements): number {
    return item.id!;
  }

  delete(traitements: ITraitements): void {
    const modalRef = this.modalService.open(TraitementsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.traitements = traitements;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
