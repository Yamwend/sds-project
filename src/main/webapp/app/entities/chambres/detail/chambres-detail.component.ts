import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChambres } from '../chambres.model';

@Component({
  selector: 'jhi-chambres-detail',
  templateUrl: './chambres-detail.component.html',
})
export class ChambresDetailComponent implements OnInit {
  chambres: IChambres | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chambres }) => {
      this.chambres = chambres;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
