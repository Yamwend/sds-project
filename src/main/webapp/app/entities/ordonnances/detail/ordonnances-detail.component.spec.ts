import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrdonnancesDetailComponent } from './ordonnances-detail.component';

describe('Ordonnances Management Detail Component', () => {
  let comp: OrdonnancesDetailComponent;
  let fixture: ComponentFixture<OrdonnancesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdonnancesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ordonnances: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrdonnancesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrdonnancesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ordonnances on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ordonnances).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
