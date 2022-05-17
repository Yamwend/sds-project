import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LaboratoiresService } from '../service/laboratoires.service';
import { ILaboratoires, Laboratoires } from '../laboratoires.model';

import { LaboratoiresUpdateComponent } from './laboratoires-update.component';

describe('Laboratoires Management Update Component', () => {
  let comp: LaboratoiresUpdateComponent;
  let fixture: ComponentFixture<LaboratoiresUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let laboratoiresService: LaboratoiresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LaboratoiresUpdateComponent],
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
      .overrideTemplate(LaboratoiresUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaboratoiresUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    laboratoiresService = TestBed.inject(LaboratoiresService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const laboratoires: ILaboratoires = { id: 456 };

      activatedRoute.data = of({ laboratoires });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(laboratoires));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Laboratoires>>();
      const laboratoires = { id: 123 };
      jest.spyOn(laboratoiresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: laboratoires }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(laboratoiresService.update).toHaveBeenCalledWith(laboratoires);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Laboratoires>>();
      const laboratoires = new Laboratoires();
      jest.spyOn(laboratoiresService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: laboratoires }));
      saveSubject.complete();

      // THEN
      expect(laboratoiresService.create).toHaveBeenCalledWith(laboratoires);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Laboratoires>>();
      const laboratoires = { id: 123 };
      jest.spyOn(laboratoiresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(laboratoiresService.update).toHaveBeenCalledWith(laboratoires);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
