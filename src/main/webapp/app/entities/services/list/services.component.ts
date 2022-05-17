import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IServices } from '../services.model';
import { ServicesService } from '../service/services.service';
import { ServicesDeleteDialogComponent } from '../delete/services-delete-dialog.component';

@Component({
  selector: 'jhi-services',
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  services?: IServices[];
  isLoading = false;

  constructor(protected servicesService: ServicesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.servicesService.query().subscribe({
      next: (res: HttpResponse<IServices[]>) => {
        this.isLoading = false;
        this.services = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IServices): number {
    return item.id!;
  }

  delete(services: IServices): void {
    const modalRef = this.modalService.open(ServicesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.services = services;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
