import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HospitalisationsDetailComponent } from './hospitalisations-detail.component';

describe('Hospitalisations Management Detail Component', () => {
  let comp: HospitalisationsDetailComponent;
  let fixture: ComponentFixture<HospitalisationsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HospitalisationsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ hospitalisations: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HospitalisationsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HospitalisationsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load hospitalisations on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.hospitalisations).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
