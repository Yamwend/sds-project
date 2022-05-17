import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MaladiesDetailComponent } from './maladies-detail.component';

describe('Maladies Management Detail Component', () => {
  let comp: MaladiesDetailComponent;
  let fixture: ComponentFixture<MaladiesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaladiesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ maladies: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MaladiesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MaladiesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load maladies on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.maladies).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
