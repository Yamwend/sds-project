import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChambresService } from '../service/chambres.service';
import { IChambres, Chambres } from '../chambres.model';
import { ICategorieChambres } from 'app/entities/categorie-chambres/categorie-chambres.model';
import { CategorieChambresService } from 'app/entities/categorie-chambres/service/categorie-chambres.service';

import { ChambresUpdateComponent } from './chambres-update.component';

describe('Chambres Management Update Component', () => {
  let comp: ChambresUpdateComponent;
  let fixture: ComponentFixture<ChambresUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chambresService: ChambresService;
  let categorieChambresService: CategorieChambresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChambresUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChambresUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChambresUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chambresService = TestBed.inject(ChambresService);
    categorieChambresService = TestBed.inject(CategorieChambresService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CategorieChambres query and add missing value', () => {
      const chambres: IChambres = { id: 456 };
      const categorie: ICategorieChambres = { id: 44177 };
      chambres.categorie = categorie;

      const categorieChambresCollection: ICategorieChambres[] = [{ id: 87812 }];
      jest.spyOn(categorieChambresService, 'query').mockReturnValue(of(new HttpResponse({ body: categorieChambresCollection })));
      const additionalCategorieChambres = [categorie];
      const expectedCollection: ICategorieChambres[] = [...additionalCategorieChambres, ...categorieChambresCollection];
      jest.spyOn(categorieChambresService, 'addCategorieChambresToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chambres });
      comp.ngOnInit();

      expect(categorieChambresService.query).toHaveBeenCalled();
      expect(categorieChambresService.addCategorieChambresToCollectionIfMissing).toHaveBeenCalledWith(
        categorieChambresCollection,
        ...additionalCategorieChambres
      );
      expect(comp.categorieChambresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chambres: IChambres = { id: 456 };
      const categorie: ICategorieChambres = { id: 60204 };
      chambres.categorie = categorie;

      activatedRoute.data = of({ chambres });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chambres));
      expect(comp.categorieChambresSharedCollection).toContain(categorie);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chambres>>();
      const chambres = { id: 123 };
      jest.spyOn(chambresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chambres });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chambres }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chambresService.update).toHaveBeenCalledWith(chambres);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chambres>>();
      const chambres = new Chambres();
      jest.spyOn(chambresService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chambres });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chambres }));
      saveSubject.complete();

      // THEN
      expect(chambresService.create).toHaveBeenCalledWith(chambres);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chambres>>();
      const chambres = { id: 123 };
      jest.spyOn(chambresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chambres });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chambresService.update).toHaveBeenCalledWith(chambres);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCategorieChambresById', () => {
      it('Should return tracked CategorieChambres primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCategorieChambresById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
