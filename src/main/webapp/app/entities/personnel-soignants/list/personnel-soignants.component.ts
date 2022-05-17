import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonnelSoignants } from '../personnel-soignants.model';
import { PersonnelSoignantsService } from '../service/personnel-soignants.service';
import { PersonnelSoignantsDeleteDialogComponent } from '../delete/personnel-soignants-delete-dialog.component';

@Component({
  selector: 'jhi-personnel-soignants',
  templateUrl: './personnel-soignants.component.html',
})
export class PersonnelSoignantsComponent implements OnInit {
  personnelSoignants?: IPersonnelSoignants[];
  isLoading = false;

  constructor(protected personnelSoignantsService: PersonnelSoignantsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.personnelSoignantsService.query().subscribe({
      next: (res: HttpResponse<IPersonnelSoignants[]>) => {
        this.isLoading = false;
        this.personnelSoignants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPersonnelSoignants): number {
    return item.id!;
  }

  delete(personnelSoignants: IPersonnelSoignants): void {
    const modalRef = this.modalService.open(PersonnelSoignantsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.personnelSoignants = personnelSoignants;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
