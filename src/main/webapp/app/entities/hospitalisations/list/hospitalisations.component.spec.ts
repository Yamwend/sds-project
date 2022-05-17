import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HospitalisationsService } from '../service/hospitalisations.service';

import { HospitalisationsComponent } from './hospitalisations.component';

describe('Hospitalisations Management Component', () => {
  let comp: HospitalisationsComponent;
  let fixture: ComponentFixture<HospitalisationsComponent>;
  let service: HospitalisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HospitalisationsComponent],
    })
      .overrideTemplate(HospitalisationsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HospitalisationsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HospitalisationsService);

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
    expect(comp.hospitalisations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
