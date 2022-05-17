import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FamilleMaladiesService } from '../service/famille-maladies.service';

import { FamilleMaladiesComponent } from './famille-maladies.component';

describe('FamilleMaladies Management Component', () => {
  let comp: FamilleMaladiesComponent;
  let fixture: ComponentFixture<FamilleMaladiesComponent>;
  let service: FamilleMaladiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FamilleMaladiesComponent],
    })
      .overrideTemplate(FamilleMaladiesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FamilleMaladiesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FamilleMaladiesService);

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
    expect(comp.familleMaladies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
