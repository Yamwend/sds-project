import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConsultationsService } from '../service/consultations.service';

import { ConsultationsComponent } from './consultations.component';

describe('Consultations Management Component', () => {
  let comp: ConsultationsComponent;
  let fixture: ComponentFixture<ConsultationsComponent>;
  let service: ConsultationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ConsultationsComponent],
    })
      .overrideTemplate(ConsultationsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsultationsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConsultationsService);

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
    expect(comp.consultations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
