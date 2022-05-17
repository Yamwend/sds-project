import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICategorieChambres, CategorieChambres } from '../categorie-chambres.model';
import { CategorieChambresService } from '../service/categorie-chambres.service';

@Component({
  selector: 'jhi-categorie-chambres-update',
  templateUrl: './categorie-chambres-update.component.html',
})
export class CategorieChambresUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelleCategory: [],
    descriptionChambre: [],
  });

  constructor(
    protected categorieChambresService: CategorieChambresService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieChambres }) => {
      this.updateForm(categorieChambres);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categorieChambres = this.createFromForm();
    if (categorieChambres.id !== undefined) {
      this.subscribeToSaveResponse(this.categorieChambresService.update(categorieChambres));
    } else {
      this.subscribeToSaveResponse(this.categorieChambresService.create(categorieChambres));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorieChambres>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(categorieChambres: ICategorieChambres): void {
    this.editForm.patchValue({
      id: categorieChambres.id,
      libelleCategory: categorieChambres.libelleCategory,
      descriptionChambre: categorieChambres.descriptionChambre,
    });
  }

  protected createFromForm(): ICategorieChambres {
    return {
      ...new CategorieChambres(),
      id: this.editForm.get(['id'])!.value,
      libelleCategory: this.editForm.get(['libelleCategory'])!.value,
      descriptionChambre: this.editForm.get(['descriptionChambre'])!.value,
    };
  }
}
