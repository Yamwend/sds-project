import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TraitementsDetailComponent } from './traitements-detail.component';

describe('Traitements Management Detail Component', () => {
  let comp: TraitementsDetailComponent;
  let fixture: ComponentFixture<TraitementsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraitementsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ traitements: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TraitementsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TraitementsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load traitements on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.traitements).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
