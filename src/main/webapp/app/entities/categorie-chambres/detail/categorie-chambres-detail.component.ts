import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategorieChambres } from '../categorie-chambres.model';

@Component({
  selector: 'jhi-categorie-chambres-detail',
  templateUrl: './categorie-chambres-detail.component.html',
})
export class CategorieChambresDetailComponent implements OnInit {
  categorieChambres: ICategorieChambres | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieChambres }) => {
      this.categorieChambres = categorieChambres;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
