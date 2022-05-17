import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExamensService } from '../service/examens.service';
import { IExamens, Examens } from '../examens.model';
import { ITypeExams } from 'app/entities/type-exams/type-exams.model';
import { TypeExamsService } from 'app/entities/type-exams/service/type-exams.service';
import { ILaboratoires } from 'app/entities/laboratoires/laboratoires.model';
import { LaboratoiresService } from 'app/entities/laboratoires/service/laboratoires.service';

import { ExamensUpdateComponent } from './examens-update.component';

describe('Examens Management Update Component', () => {
  let comp: ExamensUpdateComponent;
  let fixture: ComponentFixture<ExamensUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let examensService: ExamensService;
  let typeExamsService: TypeExamsService;
  let laboratoiresService: LaboratoiresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExamensUpdateComponent],
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
      .overrideTemplate(ExamensUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamensUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    examensService = TestBed.inject(ExamensService);
    typeExamsService = TestBed.inject(TypeExamsService);
    laboratoiresService = TestBed.inject(LaboratoiresService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeExams query and add missing value', () => {
      const examens: IExamens = { id: 456 };
      const typeExam: ITypeExams = { id: 25616 };
      examens.typeExam = typeExam;

      const typeExamsCollection: ITypeExams[] = [{ id: 45173 }];
      jest.spyOn(typeExamsService, 'query').mockReturnValue(of(new HttpResponse({ body: typeExamsCollection })));
      const additionalTypeExams = [typeExam];
      const expectedCollection: ITypeExams[] = [...additionalTypeExams, ...typeExamsCollection];
      jest.spyOn(typeExamsService, 'addTypeExamsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ examens });
      comp.ngOnInit();

      expect(typeExamsService.query).toHaveBeenCalled();
      expect(typeExamsService.addTypeExamsToCollectionIfMissing).toHaveBeenCalledWith(typeExamsCollection, ...additionalTypeExams);
      expect(comp.typeExamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Laboratoires query and add missing value', () => {
      const examens: IExamens = { id: 456 };
      const laboratoire: ILaboratoires = { id: 55422 };
      examens.laboratoire = laboratoire;

      const laboratoiresCollection: ILaboratoires[] = [{ id: 68131 }];
      jest.spyOn(laboratoiresService, 'query').mockReturnValue(of(new HttpResponse({ body: laboratoiresCollection })));
      const additionalLaboratoires = [laboratoire];
      const expectedCollection: ILaboratoires[] = [...additionalLaboratoires, ...laboratoiresCollection];
      jest.spyOn(laboratoiresService, 'addLaboratoiresToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ examens });
      comp.ngOnInit();

      expect(laboratoiresService.query).toHaveBeenCalled();
      expect(laboratoiresService.addLaboratoiresToCollectionIfMissing).toHaveBeenCalledWith(
        laboratoiresCollection,
        ...additionalLaboratoires
      );
      expect(comp.laboratoiresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const examens: IExamens = { id: 456 };
      const typeExam: ITypeExams = { id: 9479 };
      examens.typeExam = typeExam;
      const laboratoire: ILaboratoires = { id: 75242 };
      examens.laboratoire = laboratoire;

      activatedRoute.data = of({ examens });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(examens));
      expect(comp.typeExamsSharedCollection).toContain(typeExam);
      expect(comp.laboratoiresSharedCollection).toContain(laboratoire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Examens>>();
      const examens = { id: 123 };
      jest.spyOn(examensService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examens });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examens }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(examensService.update).toHaveBeenCalledWith(examens);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Examens>>();
      const examens = new Examens();
      jest.spyOn(examensService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examens });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examens }));
      saveSubject.complete();

      // THEN
      expect(examensService.create).toHaveBeenCalledWith(examens);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Examens>>();
      const examens = { id: 123 };
      jest.spyOn(examensService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examens });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(examensService.update).toHaveBeenCalledWith(examens);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypeExamsById', () => {
      it('Should return tracked TypeExams primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypeExamsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLaboratoiresById', () => {
      it('Should return tracked Laboratoires primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLaboratoiresById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
