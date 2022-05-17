import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FamilleMaladiesDetailComponent } from './famille-maladies-detail.component';

describe('FamilleMaladies Management Detail Component', () => {
  let comp: FamilleMaladiesDetailComponent;
  let fixture: ComponentFixture<FamilleMaladiesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilleMaladiesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ familleMaladies: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FamilleMaladiesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FamilleMaladiesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load familleMaladies on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.familleMaladies).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
