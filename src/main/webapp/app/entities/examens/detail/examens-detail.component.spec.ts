import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExamensDetailComponent } from './examens-detail.component';

describe('Examens Management Detail Component', () => {
  let comp: ExamensDetailComponent;
  let fixture: ComponentFixture<ExamensDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamensDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ examens: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExamensDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExamensDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load examens on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.examens).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
