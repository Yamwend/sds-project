import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrdonnancesComponent } from '../list/ordonnances.component';
import { OrdonnancesDetailComponent } from '../detail/ordonnances-detail.component';
import { OrdonnancesUpdateComponent } from '../update/ordonnances-update.component';
import { OrdonnancesRoutingResolveService } from './ordonnances-routing-resolve.service';

const ordonnancesRoute: Routes = [
  {
    path: '',
    component: OrdonnancesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrdonnancesDetailComponent,
    resolve: {
      ordonnances: OrdonnancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrdonnancesUpdateComponent,
    resolve: {
      ordonnances: OrdonnancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrdonnancesUpdateComponent,
    resolve: {
      ordonnances: OrdonnancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ordonnancesRoute)],
  exports: [RouterModule],
})
export class OrdonnancesRoutingModule {}
