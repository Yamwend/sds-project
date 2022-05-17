import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PersonnelSoignantsService } from '../service/personnel-soignants.service';

import { PersonnelSoignantsComponent } from './personnel-soignants.component';

describe('PersonnelSoignants Management Component', () => {
  let comp: PersonnelSoignantsComponent;
  let fixture: ComponentFixture<PersonnelSoignantsComponent>;
  let service: PersonnelSoignantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PersonnelSoignantsComponent],
    })
      .overrideTemplate(PersonnelSoignantsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonnelSoignantsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PersonnelSoignantsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.personnelSoignants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
