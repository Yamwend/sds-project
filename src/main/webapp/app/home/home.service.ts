import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
  //   protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categorie-chambres');
  protected miniconUrl = 'http://localhost:8000/minicon/';

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  searchwithMinicon(query: any): Observable<any> {
    return this.http.post<any>(this.miniconUrl, query);
  }
}
