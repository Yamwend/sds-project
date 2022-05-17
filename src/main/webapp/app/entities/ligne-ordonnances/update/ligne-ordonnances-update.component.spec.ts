import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LigneOrdonnancesService } from '../service/ligne-ordonnances.service';
import { ILigneOrdonnances, LigneOrdonnances } from '../ligne-ordonnances.model';
import { IOrdonnances } from 'app/entities/ordonnances/ordonnances.model';
import { OrdonnancesService } from 'app/entities/ordonnances/service/ordonnances.service';

import { LigneOrdonnancesUpdateComponent } from './ligne-ordonnances-update.component';

describe('LigneOrdonnances Management Update Component', () => {
  let comp: LigneOrdonnancesUpdateComponent;
  let fixture: ComponentFixture<LigneOrdonnancesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ligneOrdonnancesService: LigneOrdonnancesService;
  let ordonnancesService: OrdonnancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LigneOrdonnancesUpdateComponent],
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
      .overrideTemplate(LigneOrdonnancesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LigneOrdonnancesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ligneOrdonnancesService = TestBed.inject(LigneOrdonnancesService);
    ordonnancesService = TestBed.inject(OrdonnancesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ordonnances query and add missing value', () => {
      const ligneOrdonnances: ILigneOrdonnances = { id: 456 };
      const ordonnance: IOrdonnances = { id: 4568 };
      ligneOrdonnances.ordonnance = ordonnance;

      const ordonnancesCollection: IOrdonnances[] = [{ id: 12516 }];
      jest.spyOn(ordonnancesService, 'query').mockReturnValue(of(new HttpResponse({ body: ordonnancesCollection })));
      const additionalOrdonnances = [ordonnance];
      const expectedCollection: IOrdonnances[] = [...additionalOrdonnances, ...ordonnancesCollection];
      jest.spyOn(ordonnancesService, 'addOrdonnancesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ligneOrdonnances });
      comp.ngOnInit();

      expect(ordonnancesService.query).toHaveBeenCalled();
      expect(ordonnancesService.addOrdonnancesToCollectionIfMissing).toHaveBeenCalledWith(ordonnancesCollection, ...additionalOrdonnances);
      expect(comp.ordonnancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ligneOrdonnances: ILigneOrdonnances = { id: 456 };
      const ordonnance: IOrdonnances = { id: 83819 };
      ligneOrdonnances.ordonnance = ordonnance;

      activatedRoute.data = of({ ligneOrdonnances });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ligneOrdonnances));
      expect(comp.ordonnancesSharedCollection).toContain(ordonnance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LigneOrdonnances>>();
      const ligneOrdonnances = { id: 123 };
      jest.spyOn(ligneOrdonnancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ligneOrdonnances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ligneOrdonnances }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ligneOrdonnancesService.update).toHaveBeenCalledWith(ligneOrdonnances);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LigneOrdonnances>>();
      const ligneOrdonnances = new LigneOrdonnances();
      jest.spyOn(ligneOrdonnancesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ligneOrdonnances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ligneOrdonnances }));
      saveSubject.complete();

      // THEN
      expect(ligneOrdonnancesService.create).toHaveBeenCalledWith(ligneOrdonnances);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LigneOrdonnances>>();
      const ligneOrdonnances = { id: 123 };
      jest.spyOn(ligneOrdonnancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ligneOrdonnances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ligneOrdonnancesService.update).toHaveBeenCalledWith(ligneOrdonnances);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOrdonnancesById', () => {
      it('Should return tracked Ordonnances primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrdonnancesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
