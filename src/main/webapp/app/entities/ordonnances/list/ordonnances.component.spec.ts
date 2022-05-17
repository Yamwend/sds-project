import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OrdonnancesService } from '../service/ordonnances.service';

import { OrdonnancesComponent } from './ordonnances.component';

describe('Ordonnances Management Component', () => {
  let comp: OrdonnancesComponent;
  let fixture: ComponentFixture<OrdonnancesComponent>;
  let service: OrdonnancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrdonnancesComponent],
    })
      .overrideTemplate(OrdonnancesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrdonnancesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OrdonnancesService);

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
    expect(comp.ordonnances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
