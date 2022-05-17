import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CategorieChambresDetailComponent } from './categorie-chambres-detail.component';

describe('CategorieChambres Management Detail Component', () => {
  let comp: CategorieChambresDetailComponent;
  let fixture: ComponentFixture<CategorieChambresDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieChambresDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ categorieChambres: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CategorieChambresDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CategorieChambresDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load categorieChambres on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.categorieChambres).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
