import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConsultationsDetailComponent } from './consultations-detail.component';

describe('Consultations Management Detail Component', () => {
  let comp: ConsultationsDetailComponent;
  let fixture: ComponentFixture<ConsultationsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ consultations: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConsultationsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConsultationsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load consultations on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.consultations).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
