import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IChambres, Chambres } from '../chambres.model';
import { ChambresService } from '../service/chambres.service';
import { ICategorieChambres } from 'app/entities/categorie-chambres/categorie-chambres.model';
import { CategorieChambresService } from 'app/entities/categorie-chambres/service/categorie-chambres.service';

@Component({
  selector: 'jhi-chambres-update',
  templateUrl: './chambres-update.component.html',
})
export class ChambresUpdateComponent implements OnInit {
  isSaving = false;

  categorieChambresSharedCollection: ICategorieChambres[] = [];

  editForm = this.fb.group({
    id: [],
    numeroChambre: [],
    localisationChambre: [],
    nombrebLit: [],
    prixChambre: [],
    categorie: [],
  });

  constructor(
    protected chambresService: ChambresService,
    protected categorieChambresService: CategorieChambresService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chambres }) => {
      this.updateForm(chambres);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chambres = this.createFromForm();
    if (chambres.id !== undefined) {
      this.subscribeToSaveResponse(this.chambresService.update(chambres));
    } else {
      this.subscribeToSaveResponse(this.chambresService.create(chambres));
    }
  }

  trackCategorieChambresById(_index: number, item: ICategorieChambres): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChambres>>): void {
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

  protected updateForm(chambres: IChambres): void {
    this.editForm.patchValue({
      id: chambres.id,
      numeroChambre: chambres.numeroChambre,
      localisationChambre: chambres.localisationChambre,
      nombrebLit: chambres.nombrebLit,
      prixChambre: chambres.prixChambre,
      categorie: chambres.categorie,
    });

    this.categorieChambresSharedCollection = this.categorieChambresService.addCategorieChambresToCollectionIfMissing(
      this.categorieChambresSharedCollection,
      chambres.categorie
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categorieChambresService
      .query()
      .pipe(map((res: HttpResponse<ICategorieChambres[]>) => res.body ?? []))
      .pipe(
        map((categorieChambres: ICategorieChambres[]) =>
          this.categorieChambresService.addCategorieChambresToCollectionIfMissing(categorieChambres, this.editForm.get('categorie')!.value)
        )
      )
      .subscribe((categorieChambres: ICategorieChambres[]) => (this.categorieChambresSharedCollection = categorieChambres));
  }

  protected createFromForm(): IChambres {
    return {
      ...new Chambres(),
      id: this.editForm.get(['id'])!.value,
      numeroChambre: this.editForm.get(['numeroChambre'])!.value,
      localisationChambre: this.editForm.get(['localisationChambre'])!.value,
      nombrebLit: this.editForm.get(['nombrebLit'])!.value,
      prixChambre: this.editForm.get(['prixChambre'])!.value,
      categorie: this.editForm.get(['categorie'])!.value,
    };
  }
}
