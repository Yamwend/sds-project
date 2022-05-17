import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MaladiesService } from '../service/maladies.service';
import { IMaladies, Maladies } from '../maladies.model';
import { IFamilleMaladies } from 'app/entities/famille-maladies/famille-maladies.model';
import { FamilleMaladiesService } from 'app/entities/famille-maladies/service/famille-maladies.service';

import { MaladiesUpdateComponent } from './maladies-update.component';

describe('Maladies Management Update Component', () => {
  let comp: MaladiesUpdateComponent;
  let fixture: ComponentFixture<MaladiesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let maladiesService: MaladiesService;
  let familleMaladiesService: FamilleMaladiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MaladiesUpdateComponent],
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
      .overrideTemplate(MaladiesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MaladiesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    maladiesService = TestBed.inject(MaladiesService);
    familleMaladiesService = TestBed.inject(FamilleMaladiesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FamilleMaladies query and add missing value', () => {
      const maladies: IMaladies = { id: 456 };
      const famille: IFamilleMaladies = { id: 25353 };
      maladies.famille = famille;

      const familleMaladiesCollection: IFamilleMaladies[] = [{ id: 14681 }];
      jest.spyOn(familleMaladiesService, 'query').mockReturnValue(of(new HttpResponse({ body: familleMaladiesCollection })));
      const additionalFamilleMaladies = [famille];
      const expectedCollection: IFamilleMaladies[] = [...additionalFamilleMaladies, ...familleMaladiesCollection];
      jest.spyOn(familleMaladiesService, 'addFamilleMaladiesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ maladies });
      comp.ngOnInit();

      expect(familleMaladiesService.query).toHaveBeenCalled();
      expect(familleMaladiesService.addFamilleMaladiesToCollectionIfMissing).toHaveBeenCalledWith(
        familleMaladiesCollection,
        ...additionalFamilleMaladies
      );
      expect(comp.familleMaladiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const maladies: IMaladies = { id: 456 };
      const famille: IFamilleMaladies = { id: 46243 };
      maladies.famille = famille;

      activatedRoute.data = of({ maladies });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(maladies));
      expect(comp.familleMaladiesSharedCollection).toContain(famille);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Maladies>>();
      const maladies = { id: 123 };
      jest.spyOn(maladiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maladies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: maladies }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(maladiesService.update).toHaveBeenCalledWith(maladies);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Maladies>>();
      const maladies = new Maladies();
      jest.spyOn(maladiesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maladies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: maladies }));
      saveSubject.complete();

      // THEN
      expect(maladiesService.create).toHaveBeenCalledWith(maladies);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Maladies>>();
      const maladies = { id: 123 };
      jest.spyOn(maladiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maladies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(maladiesService.update).toHaveBeenCalledWith(maladies);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFamilleMaladiesById', () => {
      it('Should return tracked FamilleMaladies primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFamilleMaladiesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
