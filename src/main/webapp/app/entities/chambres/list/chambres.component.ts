import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChambres } from '../chambres.model';
import { ChambresService } from '../service/chambres.service';
import { ChambresDeleteDialogComponent } from '../delete/chambres-delete-dialog.component';

@Component({
  selector: 'jhi-chambres',
  templateUrl: './chambres.component.html',
})
export class ChambresComponent implements OnInit {
  chambres?: IChambres[];
  isLoading = false;

  constructor(protected chambresService: ChambresService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chambresService.query().subscribe({
      next: (res: HttpResponse<IChambres[]>) => {
        this.isLoading = false;
        this.chambres = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IChambres): number {
    return item.id!;
  }

  delete(chambres: IChambres): void {
    const modalRef = this.modalService.open(ChambresDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chambres = chambres;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
