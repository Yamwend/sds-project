import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LaboratoiresDetailComponent } from './laboratoires-detail.component';

describe('Laboratoires Management Detail Component', () => {
  let comp: LaboratoiresDetailComponent;
  let fixture: ComponentFixture<LaboratoiresDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaboratoiresDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ laboratoires: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LaboratoiresDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LaboratoiresDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load laboratoires on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.laboratoires).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
