import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LaboratoiresService } from '../service/laboratoires.service';

import { LaboratoiresComponent } from './laboratoires.component';

describe('Laboratoires Management Component', () => {
  let comp: LaboratoiresComponent;
  let fixture: ComponentFixture<LaboratoiresComponent>;
  let service: LaboratoiresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LaboratoiresComponent],
    })
      .overrideTemplate(LaboratoiresComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaboratoiresComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LaboratoiresService);

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
    expect(comp.laboratoires?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
