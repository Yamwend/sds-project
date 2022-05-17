import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HospitalisationsComponent } from '../list/hospitalisations.component';
import { HospitalisationsDetailComponent } from '../detail/hospitalisations-detail.component';
import { HospitalisationsUpdateComponent } from '../update/hospitalisations-update.component';
import { HospitalisationsRoutingResolveService } from './hospitalisations-routing-resolve.service';

const hospitalisationsRoute: Routes = [
  {
    path: '',
    component: HospitalisationsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HospitalisationsDetailComponent,
    resolve: {
      hospitalisations: HospitalisationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HospitalisationsUpdateComponent,
    resolve: {
      hospitalisations: HospitalisationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HospitalisationsUpdateComponent,
    resolve: {
      hospitalisations: HospitalisationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hospitalisationsRoute)],
  exports: [RouterModule],
})
export class HospitalisationsRoutingModule {}
