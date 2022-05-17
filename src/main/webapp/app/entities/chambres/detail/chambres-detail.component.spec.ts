import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChambresDetailComponent } from './chambres-detail.component';

describe('Chambres Management Detail Component', () => {
  let comp: ChambresDetailComponent;
  let fixture: ComponentFixture<ChambresDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChambresDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chambres: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChambresDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChambresDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chambres on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chambres).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
