import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HospitalisationsService } from '../service/hospitalisations.service';
import { IHospitalisations, Hospitalisations } from '../hospitalisations.model';
import { IChambres } from 'app/entities/chambres/chambres.model';
import { ChambresService } from 'app/entities/chambres/service/chambres.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';

import { HospitalisationsUpdateComponent } from './hospitalisations-update.component';

describe('Hospitalisations Management Update Component', () => {
  let comp: HospitalisationsUpdateComponent;
  let fixture: ComponentFixture<HospitalisationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hospitalisationsService: HospitalisationsService;
  let chambresService: ChambresService;
  let patientsService: PatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HospitalisationsUpdateComponent],
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
      .overrideTemplate(HospitalisationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HospitalisationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hospitalisationsService = TestBed.inject(HospitalisationsService);
    chambresService = TestBed.inject(ChambresService);
    patientsService = TestBed.inject(PatientsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Chambres query and add missing value', () => {
      const hospitalisations: IHospitalisations = { id: 456 };
      const chambre: IChambres = { id: 32318 };
      hospitalisations.chambre = chambre;

      const chambresCollection: IChambres[] = [{ id: 50784 }];
      jest.spyOn(chambresService, 'query').mockReturnValue(of(new HttpResponse({ body: chambresCollection })));
      const additionalChambres = [chambre];
      const expectedCollection: IChambres[] = [...additionalChambres, ...chambresCollection];
      jest.spyOn(chambresService, 'addChambresToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hospitalisations });
      comp.ngOnInit();

      expect(chambresService.query).toHaveBeenCalled();
      expect(chambresService.addChambresToCollectionIfMissing).toHaveBeenCalledWith(chambresCollection, ...additionalChambres);
      expect(comp.chambresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Patients query and add missing value', () => {
      const hospitalisations: IHospitalisations = { id: 456 };
      const patient: IPatients = { id: 18862 };
      hospitalisations.patient = patient;

      const patientsCollection: IPatients[] = [{ id: 11239 }];
      jest.spyOn(patientsService, 'query').mockReturnValue(of(new HttpResponse({ body: patientsCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatients[] = [...additionalPatients, ...patientsCollection];
      jest.spyOn(patientsService, 'addPatientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hospitalisations });
      comp.ngOnInit();

      expect(patientsService.query).toHaveBeenCalled();
      expect(patientsService.addPatientsToCollectionIfMissing).toHaveBeenCalledWith(patientsCollection, ...additionalPatients);
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const hospitalisations: IHospitalisations = { id: 456 };
      const chambre: IChambres = { id: 35477 };
      hospitalisations.chambre = chambre;
      const patient: IPatients = { id: 9765 };
      hospitalisations.patient = patient;

      activatedRoute.data = of({ hospitalisations });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(hospitalisations));
      expect(comp.chambresSharedCollection).toContain(chambre);
      expect(comp.patientsSharedCollection).toContain(patient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hospitalisations>>();
      const hospitalisations = { id: 123 };
      jest.spyOn(hospitalisationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hospitalisations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hospitalisations }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(hospitalisationsService.update).toHaveBeenCalledWith(hospitalisations);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hospitalisations>>();
      const hospitalisations = new Hospitalisations();
      jest.spyOn(hospitalisationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hospitalisations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hospitalisations }));
      saveSubject.complete();

      // THEN
      expect(hospitalisationsService.create).toHaveBeenCalledWith(hospitalisations);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hospitalisations>>();
      const hospitalisations = { id: 123 };
      jest.spyOn(hospitalisationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hospitalisations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hospitalisationsService.update).toHaveBeenCalledWith(hospitalisations);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChambresById', () => {
      it('Should return tracked Chambres primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChambresById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPatientsById', () => {
      it('Should return tracked Patients primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPatientsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
