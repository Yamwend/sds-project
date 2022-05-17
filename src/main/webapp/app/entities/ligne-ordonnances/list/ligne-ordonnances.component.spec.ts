import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LigneOrdonnancesService } from '../service/ligne-ordonnances.service';

import { LigneOrdonnancesComponent } from './ligne-ordonnances.component';

describe('LigneOrdonnances Management Component', () => {
  let comp: LigneOrdonnancesComponent;
  let fixture: ComponentFixture<LigneOrdonnancesComponent>;
  let service: LigneOrdonnancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LigneOrdonnancesComponent],
    })
      .overrideTemplate(LigneOrdonnancesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LigneOrdonnancesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LigneOrdonnancesService);

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
    expect(comp.ligneOrdonnances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
