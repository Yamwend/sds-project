import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MaladiesService } from '../service/maladies.service';

import { MaladiesComponent } from './maladies.component';

describe('Maladies Management Component', () => {
  let comp: MaladiesComponent;
  let fixture: ComponentFixture<MaladiesComponent>;
  let service: MaladiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MaladiesComponent],
    })
      .overrideTemplate(MaladiesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MaladiesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MaladiesService);

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
    expect(comp.maladies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
