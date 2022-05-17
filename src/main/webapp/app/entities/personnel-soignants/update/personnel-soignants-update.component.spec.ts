import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PersonnelSoignantsService } from '../service/personnel-soignants.service';
import { IPersonnelSoignants, PersonnelSoignants } from '../personnel-soignants.model';
import { IServices } from 'app/entities/services/services.model';
import { ServicesService } from 'app/entities/services/service/services.service';

import { PersonnelSoignantsUpdateComponent } from './personnel-soignants-update.component';

describe('PersonnelSoignants Management Update Component', () => {
  let comp: PersonnelSoignantsUpdateComponent;
  let fixture: ComponentFixture<PersonnelSoignantsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let personnelSoignantsService: PersonnelSoignantsService;
  let servicesService: ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PersonnelSoignantsUpdateComponent],
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
      .overrideTemplate(PersonnelSoignantsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonnelSoignantsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    personnelSoignantsService = TestBed.inject(PersonnelSoignantsService);
    servicesService = TestBed.inject(ServicesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Services query and add missing value', () => {
      const personnelSoignants: IPersonnelSoignants = { id: 456 };
      const service: IServices = { id: 45903 };
      personnelSoignants.service = service;

      const servicesCollection: IServices[] = [{ id: 65605 }];
      jest.spyOn(servicesService, 'query').mockReturnValue(of(new HttpResponse({ body: servicesCollection })));
      const additionalServices = [service];
      const expectedCollection: IServices[] = [...additionalServices, ...servicesCollection];
      jest.spyOn(servicesService, 'addServicesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ personnelSoignants });
      comp.ngOnInit();

      expect(servicesService.query).toHaveBeenCalled();
      expect(servicesService.addServicesToCollectionIfMissing).toHaveBeenCalledWith(servicesCollection, ...additionalServices);
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const personnelSoignants: IPersonnelSoignants = { id: 456 };
      const service: IServices = { id: 24624 };
      personnelSoignants.service = service;

      activatedRoute.data = of({ personnelSoignants });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(personnelSoignants));
      expect(comp.servicesSharedCollection).toContain(service);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PersonnelSoignants>>();
      const personnelSoignants = { id: 123 };
      jest.spyOn(personnelSoignantsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personnelSoignants });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personnelSoignants }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(personnelSoignantsService.update).toHaveBeenCalledWith(personnelSoignants);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PersonnelSoignants>>();
      const personnelSoignants = new PersonnelSoignants();
      jest.spyOn(personnelSoignantsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personnelSoignants });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personnelSoignants }));
      saveSubject.complete();

      // THEN
      expect(personnelSoignantsService.create).toHaveBeenCalledWith(personnelSoignants);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PersonnelSoignants>>();
      const personnelSoignants = { id: 123 };
      jest.spyOn(personnelSoignantsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personnelSoignants });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(personnelSoignantsService.update).toHaveBeenCalledWith(personnelSoignants);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackServicesById', () => {
      it('Should return tracked Services primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackServicesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
