import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PatientsService } from '../service/patients.service';

import { PatientsComponent } from './patients.component';

describe('Patients Management Component', () => {
  let comp: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;
  let service: PatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PatientsComponent],
    })
      .overrideTemplate(PatientsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PatientsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PatientsService);

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
    expect(comp.patients?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
