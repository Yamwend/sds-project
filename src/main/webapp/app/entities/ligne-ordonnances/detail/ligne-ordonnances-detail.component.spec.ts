import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LigneOrdonnancesDetailComponent } from './ligne-ordonnances-detail.component';

describe('LigneOrdonnances Management Detail Component', () => {
  let comp: LigneOrdonnancesDetailComponent;
  let fixture: ComponentFixture<LigneOrdonnancesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LigneOrdonnancesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ligneOrdonnances: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LigneOrdonnancesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LigneOrdonnancesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ligneOrdonnances on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ligneOrdonnances).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
