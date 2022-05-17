import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TraitementsService } from '../service/traitements.service';
import { ITraitements, Traitements } from '../traitements.model';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { IMaladies } from 'app/entities/maladies/maladies.model';
import { MaladiesService } from 'app/entities/maladies/service/maladies.service';
import { IOrdonnances } from 'app/entities/ordonnances/ordonnances.model';
import { OrdonnancesService } from 'app/entities/ordonnances/service/ordonnances.service';
import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';
import { PersonnelSoignantsService } from 'app/entities/personnel-soignants/service/personnel-soignants.service';

import { TraitementsUpdateComponent } from './traitements-update.component';

describe('Traitements Management Update Component', () => {
  let comp: TraitementsUpdateComponent;
  let fixture: ComponentFixture<TraitementsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let traitementsService: TraitementsService;
  let patientsService: PatientsService;
  let maladiesService: MaladiesService;
  let ordonnancesService: OrdonnancesService;
  let personnelSoignantsService: PersonnelSoignantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TraitementsUpdateComponent],
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
      .overrideTemplate(TraitementsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TraitementsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    traitementsService = TestBed.inject(TraitementsService);
    patientsService = TestBed.inject(PatientsService);
    maladiesService = TestBed.inject(MaladiesService);
    ordonnancesService = TestBed.inject(OrdonnancesService);
    personnelSoignantsService = TestBed.inject(PersonnelSoignantsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Patients query and add missing value', () => {
      const traitements: ITraitements = { id: 456 };
      const patient: IPatients = { id: 65055 };
      traitements.patient = patient;

      const patientsCollection: IPatients[] = [{ id: 13781 }];
      jest.spyOn(patientsService, 'query').mockReturnValue(of(new HttpResponse({ body: patientsCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatients[] = [...additionalPatients, ...patientsCollection];
      jest.spyOn(patientsService, 'addPatientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      expect(patientsService.query).toHaveBeenCalled();
      expect(patientsService.addPatientsToCollectionIfMissing).toHaveBeenCalledWith(patientsCollection, ...additionalPatients);
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Maladies query and add missing value', () => {
      const traitements: ITraitements = { id: 456 };
      const maladie: IMaladies = { id: 44886 };
      traitements.maladie = maladie;

      const maladiesCollection: IMaladies[] = [{ id: 22203 }];
      jest.spyOn(maladiesService, 'query').mockReturnValue(of(new HttpResponse({ body: maladiesCollection })));
      const additionalMaladies = [maladie];
      const expectedCollection: IMaladies[] = [...additionalMaladies, ...maladiesCollection];
      jest.spyOn(maladiesService, 'addMaladiesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      expect(maladiesService.query).toHaveBeenCalled();
      expect(maladiesService.addMaladiesToCollectionIfMissing).toHaveBeenCalledWith(maladiesCollection, ...additionalMaladies);
      expect(comp.maladiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ordonnances query and add missing value', () => {
      const traitements: ITraitements = { id: 456 };
      const ordonnance: IOrdonnances = { id: 89371 };
      traitements.ordonnance = ordonnance;

      const ordonnancesCollection: IOrdonnances[] = [{ id: 34079 }];
      jest.spyOn(ordonnancesService, 'query').mockReturnValue(of(new HttpResponse({ body: ordonnancesCollection })));
      const additionalOrdonnances = [ordonnance];
      const expectedCollection: IOrdonnances[] = [...additionalOrdonnances, ...ordonnancesCollection];
      jest.spyOn(ordonnancesService, 'addOrdonnancesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      expect(ordonnancesService.query).toHaveBeenCalled();
      expect(ordonnancesService.addOrdonnancesToCollectionIfMissing).toHaveBeenCalledWith(ordonnancesCollection, ...additionalOrdonnances);
      expect(comp.ordonnancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PersonnelSoignants query and add missing value', () => {
      const traitements: ITraitements = { id: 456 };
      const personnel: IPersonnelSoignants = { id: 2910 };
      traitements.personnel = personnel;

      const personnelSoignantsCollection: IPersonnelSoignants[] = [{ id: 32287 }];
      jest.spyOn(personnelSoignantsService, 'query').mockReturnValue(of(new HttpResponse({ body: personnelSoignantsCollection })));
      const additionalPersonnelSoignants = [personnel];
      const expectedCollection: IPersonnelSoignants[] = [...additionalPersonnelSoignants, ...personnelSoignantsCollection];
      jest.spyOn(personnelSoignantsService, 'addPersonnelSoignantsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      expect(personnelSoignantsService.query).toHaveBeenCalled();
      expect(personnelSoignantsService.addPersonnelSoignantsToCollectionIfMissing).toHaveBeenCalledWith(
        personnelSoignantsCollection,
        ...additionalPersonnelSoignants
      );
      expect(comp.personnelSoignantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const traitements: ITraitements = { id: 456 };
      const patient: IPatients = { id: 65038 };
      traitements.patient = patient;
      const maladie: IMaladies = { id: 94350 };
      traitements.maladie = maladie;
      const ordonnance: IOrdonnances = { id: 50448 };
      traitements.ordonnance = ordonnance;
      const personnel: IPersonnelSoignants = { id: 214 };
      traitements.personnel = personnel;

      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(traitements));
      expect(comp.patientsSharedCollection).toContain(patient);
      expect(comp.maladiesSharedCollection).toContain(maladie);
      expect(comp.ordonnancesSharedCollection).toContain(ordonnance);
      expect(comp.personnelSoignantsSharedCollection).toContain(personnel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Traitements>>();
      const traitements = { id: 123 };
      jest.spyOn(traitementsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: traitements }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(traitementsService.update).toHaveBeenCalledWith(traitements);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Traitements>>();
      const traitements = new Traitements();
      jest.spyOn(traitementsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: traitements }));
      saveSubject.complete();

      // THEN
      expect(traitementsService.create).toHaveBeenCalledWith(traitements);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Traitements>>();
      const traitements = { id: 123 };
      jest.spyOn(traitementsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ traitements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(traitementsService.update).toHaveBeenCalledWith(traitements);
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

    describe('trackMaladiesById', () => {
      it('Should return tracked Maladies primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackMaladiesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOrdonnancesById', () => {
      it('Should return tracked Ordonnances primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrdonnancesById(0, entity);
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
  });
});
