import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PersonnelSoignantsDetailComponent } from './personnel-soignants-detail.component';

describe('PersonnelSoignants Management Detail Component', () => {
  let comp: PersonnelSoignantsDetailComponent;
  let fixture: ComponentFixture<PersonnelSoignantsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelSoignantsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ personnelSoignants: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PersonnelSoignantsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PersonnelSoignantsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load personnelSoignants on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.personnelSoignants).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
