import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHospitalisations } from '../hospitalisations.model';
import { HospitalisationsService } from '../service/hospitalisations.service';
import { HospitalisationsDeleteDialogComponent } from '../delete/hospitalisations-delete-dialog.component';

@Component({
  selector: 'jhi-hospitalisations',
  templateUrl: './hospitalisations.component.html',
})
export class HospitalisationsComponent implements OnInit {
  hospitalisations?: IHospitalisations[];
  isLoading = false;

  constructor(protected hospitalisationsService: HospitalisationsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.hospitalisationsService.query().subscribe({
      next: (res: HttpResponse<IHospitalisations[]>) => {
        this.isLoading = false;
        this.hospitalisations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IHospitalisations): number {
    return item.id!;
  }

  delete(hospitalisations: IHospitalisations): void {
    const modalRef = this.modalService.open(HospitalisationsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.hospitalisations = hospitalisations;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
