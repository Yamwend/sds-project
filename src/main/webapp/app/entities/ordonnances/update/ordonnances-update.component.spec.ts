import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrdonnancesService } from '../service/ordonnances.service';
import { IOrdonnances, Ordonnances } from '../ordonnances.model';

import { OrdonnancesUpdateComponent } from './ordonnances-update.component';

describe('Ordonnances Management Update Component', () => {
  let comp: OrdonnancesUpdateComponent;
  let fixture: ComponentFixture<OrdonnancesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ordonnancesService: OrdonnancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrdonnancesUpdateComponent],
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
      .overrideTemplate(OrdonnancesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrdonnancesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ordonnancesService = TestBed.inject(OrdonnancesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ordonnances: IOrdonnances = { id: 456 };

      activatedRoute.data = of({ ordonnances });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ordonnances));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ordonnances>>();
      const ordonnances = { id: 123 };
      jest.spyOn(ordonnancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordonnances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ordonnances }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ordonnancesService.update).toHaveBeenCalledWith(ordonnances);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ordonnances>>();
      const ordonnances = new Ordonnances();
      jest.spyOn(ordonnancesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordonnances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ordonnances }));
      saveSubject.complete();

      // THEN
      expect(ordonnancesService.create).toHaveBeenCalledWith(ordonnances);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ordonnances>>();
      const ordonnances = { id: 123 };
      jest.spyOn(ordonnancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordonnances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ordonnancesService.update).toHaveBeenCalledWith(ordonnances);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
