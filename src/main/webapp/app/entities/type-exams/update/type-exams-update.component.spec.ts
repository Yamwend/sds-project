import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeExamsService } from '../service/type-exams.service';
import { ITypeExams, TypeExams } from '../type-exams.model';

import { TypeExamsUpdateComponent } from './type-exams-update.component';

describe('TypeExams Management Update Component', () => {
  let comp: TypeExamsUpdateComponent;
  let fixture: ComponentFixture<TypeExamsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeExamsService: TypeExamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeExamsUpdateComponent],
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
      .overrideTemplate(TypeExamsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeExamsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeExamsService = TestBed.inject(TypeExamsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeExams: ITypeExams = { id: 456 };

      activatedRoute.data = of({ typeExams });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeExams));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeExams>>();
      const typeExams = { id: 123 };
      jest.spyOn(typeExamsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeExams });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeExams }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeExamsService.update).toHaveBeenCalledWith(typeExams);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeExams>>();
      const typeExams = new TypeExams();
      jest.spyOn(typeExamsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeExams });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeExams }));
      saveSubject.complete();

      // THEN
      expect(typeExamsService.create).toHaveBeenCalledWith(typeExams);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeExams>>();
      const typeExams = { id: 123 };
      jest.spyOn(typeExamsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeExams });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeExamsService.update).toHaveBeenCalledWith(typeExams);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
