import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMaladies } from '../maladies.model';
import { MaladiesService } from '../service/maladies.service';
import { MaladiesDeleteDialogComponent } from '../delete/maladies-delete-dialog.component';

@Component({
  selector: 'jhi-maladies',
  templateUrl: './maladies.component.html',
})
export class MaladiesComponent implements OnInit {
  maladies?: IMaladies[];
  isLoading = false;

  constructor(protected maladiesService: MaladiesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.maladiesService.query().subscribe({
      next: (res: HttpResponse<IMaladies[]>) => {
        this.isLoading = false;
        this.maladies = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMaladies): number {
    return item.id!;
  }

  delete(maladies: IMaladies): void {
    const modalRef = this.modalService.open(MaladiesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.maladies = maladies;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
