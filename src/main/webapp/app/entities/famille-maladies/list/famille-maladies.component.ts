import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFamilleMaladies } from '../famille-maladies.model';
import { FamilleMaladiesService } from '../service/famille-maladies.service';
import { FamilleMaladiesDeleteDialogComponent } from '../delete/famille-maladies-delete-dialog.component';

@Component({
  selector: 'jhi-famille-maladies',
  templateUrl: './famille-maladies.component.html',
})
export class FamilleMaladiesComponent implements OnInit {
  familleMaladies?: IFamilleMaladies[];
  isLoading = false;

  constructor(protected familleMaladiesService: FamilleMaladiesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.familleMaladiesService.query().subscribe({
      next: (res: HttpResponse<IFamilleMaladies[]>) => {
        this.isLoading = false;
        this.familleMaladies = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFamilleMaladies): number {
    return item.id!;
  }

  delete(familleMaladies: IFamilleMaladies): void {
    const modalRef = this.modalService.open(FamilleMaladiesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.familleMaladies = familleMaladies;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
