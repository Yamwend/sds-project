import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FamilleMaladiesService } from '../service/famille-maladies.service';
import { IFamilleMaladies, FamilleMaladies } from '../famille-maladies.model';

import { FamilleMaladiesUpdateComponent } from './famille-maladies-update.component';

describe('FamilleMaladies Management Update Component', () => {
  let comp: FamilleMaladiesUpdateComponent;
  let fixture: ComponentFixture<FamilleMaladiesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let familleMaladiesService: FamilleMaladiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FamilleMaladiesUpdateComponent],
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
      .overrideTemplate(FamilleMaladiesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FamilleMaladiesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    familleMaladiesService = TestBed.inject(FamilleMaladiesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const familleMaladies: IFamilleMaladies = { id: 456 };

      activatedRoute.data = of({ familleMaladies });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(familleMaladies));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FamilleMaladies>>();
      const familleMaladies = { id: 123 };
      jest.spyOn(familleMaladiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familleMaladies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: familleMaladies }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(familleMaladiesService.update).toHaveBeenCalledWith(familleMaladies);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FamilleMaladies>>();
      const familleMaladies = new FamilleMaladies();
      jest.spyOn(familleMaladiesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familleMaladies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: familleMaladies }));
      saveSubject.complete();

      // THEN
      expect(familleMaladiesService.create).toHaveBeenCalledWith(familleMaladies);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FamilleMaladies>>();
      const familleMaladies = { id: 123 };
      jest.spyOn(familleMaladiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familleMaladies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(familleMaladiesService.update).toHaveBeenCalledWith(familleMaladies);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
