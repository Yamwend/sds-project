import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CategorieChambresService } from '../service/categorie-chambres.service';
import { ICategorieChambres, CategorieChambres } from '../categorie-chambres.model';

import { CategorieChambresUpdateComponent } from './categorie-chambres-update.component';

describe('CategorieChambres Management Update Component', () => {
  let comp: CategorieChambresUpdateComponent;
  let fixture: ComponentFixture<CategorieChambresUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categorieChambresService: CategorieChambresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CategorieChambresUpdateComponent],
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
      .overrideTemplate(CategorieChambresUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategorieChambresUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categorieChambresService = TestBed.inject(CategorieChambresService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const categorieChambres: ICategorieChambres = { id: 456 };

      activatedRoute.data = of({ categorieChambres });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(categorieChambres));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieChambres>>();
      const categorieChambres = { id: 123 };
      jest.spyOn(categorieChambresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieChambres });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorieChambres }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(categorieChambresService.update).toHaveBeenCalledWith(categorieChambres);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieChambres>>();
      const categorieChambres = new CategorieChambres();
      jest.spyOn(categorieChambresService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieChambres });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorieChambres }));
      saveSubject.complete();

      // THEN
      expect(categorieChambresService.create).toHaveBeenCalledWith(categorieChambres);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieChambres>>();
      const categorieChambres = { id: 123 };
      jest.spyOn(categorieChambresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieChambres });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(categorieChambresService.update).toHaveBeenCalledWith(categorieChambres);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
