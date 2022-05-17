import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConsultationsService } from '../service/consultations.service';
import { IConsultations, Consultations } from '../consultations.model';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';
import { PersonnelSoignantsService } from 'app/entities/personnel-soignants/service/personnel-soignants.service';
import { IExamens } from 'app/entities/examens/examens.model';
import { ExamensService } from 'app/entities/examens/service/examens.service';

import { ConsultationsUpdateComponent } from './consultations-update.component';

describe('Consultations Management Update Component', () => {
  let comp: ConsultationsUpdateComponent;
  let fixture: ComponentFixture<ConsultationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let consultationsService: ConsultationsService;
  let patientsService: PatientsService;
  let personnelSoignantsService: PersonnelSoignantsService;
  let examensService: ExamensService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConsultationsUpdateComponent],
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
      .overrideTemplate(ConsultationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsultationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    consultationsService = TestBed.inject(ConsultationsService);
    patientsService = TestBed.inject(PatientsService);
    personnelSoignantsService = TestBed.inject(PersonnelSoignantsService);
    examensService = TestBed.inject(ExamensService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Patients query and add missing value', () => {
      const consultations: IConsultations = { id: 456 };
      const patient: IPatients = { id: 88957 };
      consultations.patient = patient;

      const patientsCollection: IPatients[] = [{ id: 85876 }];
      jest.spyOn(patientsService, 'query').mockReturnValue(of(new HttpResponse({ body: patientsCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatients[] = [...additionalPatients, ...patientsCollection];
      jest.spyOn(patientsService, 'addPatientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      expect(patientsService.query).toHaveBeenCalled();
      expect(patientsService.addPatientsToCollectionIfMissing).toHaveBeenCalledWith(patientsCollection, ...additionalPatients);
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PersonnelSoignants query and add missing value', () => {
      const consultations: IConsultations = { id: 456 };
      const personnel: IPersonnelSoignants = { id: 56998 };
      consultations.personnel = personnel;

      const personnelSoignantsCollection: IPersonnelSoignants[] = [{ id: 32338 }];
      jest.spyOn(personnelSoignantsService, 'query').mockReturnValue(of(new HttpResponse({ body: personnelSoignantsCollection })));
      const additionalPersonnelSoignants = [personnel];
      const expectedCollection: IPersonnelSoignants[] = [...additionalPersonnelSoignants, ...personnelSoignantsCollection];
      jest.spyOn(personnelSoignantsService, 'addPersonnelSoignantsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      expect(personnelSoignantsService.query).toHaveBeenCalled();
      expect(personnelSoignantsService.addPersonnelSoignantsToCollectionIfMissing).toHaveBeenCalledWith(
        personnelSoignantsCollection,
        ...additionalPersonnelSoignants
      );
      expect(comp.personnelSoignantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Examens query and add missing value', () => {
      const consultations: IConsultations = { id: 456 };
      const examen: IExamens = { id: 26086 };
      consultations.examen = examen;

      const examensCollection: IExamens[] = [{ id: 70025 }];
      jest.spyOn(examensService, 'query').mockReturnValue(of(new HttpResponse({ body: examensCollection })));
      const additionalExamens = [examen];
      const expectedCollection: IExamens[] = [...additionalExamens, ...examensCollection];
      jest.spyOn(examensService, 'addExamensToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      expect(examensService.query).toHaveBeenCalled();
      expect(examensService.addExamensToCollectionIfMissing).toHaveBeenCalledWith(examensCollection, ...additionalExamens);
      expect(comp.examensSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const consultations: IConsultations = { id: 456 };
      const patient: IPatients = { id: 18328 };
      consultations.patient = patient;
      const personnel: IPersonnelSoignants = { id: 56428 };
      consultations.personnel = personnel;
      const examen: IExamens = { id: 97454 };
      consultations.examen = examen;

      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(consultations));
      expect(comp.patientsSharedCollection).toContain(patient);
      expect(comp.personnelSoignantsSharedCollection).toContain(personnel);
      expect(comp.examensSharedCollection).toContain(examen);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Consultations>>();
      const consultations = { id: 123 };
      jest.spyOn(consultationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consultations }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(consultationsService.update).toHaveBeenCalledWith(consultations);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Consultations>>();
      const consultations = new Consultations();
      jest.spyOn(consultationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consultations }));
      saveSubject.complete();

      // THEN
      expect(consultationsService.create).toHaveBeenCalledWith(consultations);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Consultations>>();
      const consultations = { id: 123 };
      jest.spyOn(consultationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consultations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(consultationsService.update).toHaveBeenCalledWith(consultations);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPatientsById', () => {
      it('Should return tracked Patients primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPatientsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPersonnelSoignantsById', () => {
      it('Should return tracked PersonnelSoignants primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPersonnelSoignantsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackExamensById', () => {
      it('Should return tracked Examens primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExamensById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
