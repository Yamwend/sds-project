import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConsultationsComponent } from '../list/consultations.component';
import { ConsultationsDetailComponent } from '../detail/consultations-detail.component';
import { ConsultationsUpdateComponent } from '../update/consultations-update.component';
import { ConsultationsRoutingResolveService } from './consultations-routing-resolve.service';

const consultationsRoute: Routes = [
  {
    path: '',
    component: ConsultationsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConsultationsDetailComponent,
    resolve: {
      consultations: ConsultationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConsultationsUpdateComponent,
    resolve: {
      consultations: ConsultationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConsultationsUpdateComponent,
    resolve: {
      consultations: ConsultationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(consultationsRoute)],
  exports: [RouterModule],
})
export class ConsultationsRoutingModule {}
