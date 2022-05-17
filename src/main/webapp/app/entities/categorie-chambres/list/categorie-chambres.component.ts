import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategorieChambres } from '../categorie-chambres.model';
import { CategorieChambresService } from '../service/categorie-chambres.service';
import { CategorieChambresDeleteDialogComponent } from '../delete/categorie-chambres-delete-dialog.component';

@Component({
  selector: 'jhi-categorie-chambres',
  templateUrl: './categorie-chambres.component.html',
})
export class CategorieChambresComponent implements OnInit {
  categorieChambres?: ICategorieChambres[];
  isLoading = false;

  constructor(protected categorieChambresService: CategorieChambresService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.categorieChambresService.query().subscribe({
      next: (res: HttpResponse<ICategorieChambres[]>) => {
        this.isLoading = false;
        this.categorieChambres = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICategorieChambres): number {
    return item.id!;
  }

  delete(categorieChambres: ICategorieChambres): void {
    const modalRef = this.modalService.open(CategorieChambresDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.categorieChambres = categorieChambres;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
