import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILigneOrdonnances } from '../ligne-ordonnances.model';
import { LigneOrdonnancesService } from '../service/ligne-ordonnances.service';
import { LigneOrdonnancesDeleteDialogComponent } from '../delete/ligne-ordonnances-delete-dialog.component';

@Component({
  selector: 'jhi-ligne-ordonnances',
  templateUrl: './ligne-ordonnances.component.html',
})
export class LigneOrdonnancesComponent implements OnInit {
  ligneOrdonnances?: ILigneOrdonnances[];
  isLoading = false;

  constructor(protected ligneOrdonnancesService: LigneOrdonnancesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ligneOrdonnancesService.query().subscribe({
      next: (res: HttpResponse<ILigneOrdonnances[]>) => {
        this.isLoading = false;
        this.ligneOrdonnances = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILigneOrdonnances): number {
    return item.id!;
  }

  delete(ligneOrdonnances: ILigneOrdonnances): void {
    const modalRef = this.modalService.open(LigneOrdonnancesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ligneOrdonnances = ligneOrdonnances;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
