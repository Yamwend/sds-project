import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeExamsDetailComponent } from './type-exams-detail.component';

describe('TypeExams Management Detail Component', () => {
  let comp: TypeExamsDetailComponent;
  let fixture: ComponentFixture<TypeExamsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeExamsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeExams: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeExamsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeExamsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeExams on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeExams).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
