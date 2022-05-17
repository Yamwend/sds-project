import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FamilleMaladiesComponent } from '../list/famille-maladies.component';
import { FamilleMaladiesDetailComponent } from '../detail/famille-maladies-detail.component';
import { FamilleMaladiesUpdateComponent } from '../update/famille-maladies-update.component';
import { FamilleMaladiesRoutingResolveService } from './famille-maladies-routing-resolve.service';

const familleMaladiesRoute: Routes = [
  {
    path: '',
    component: FamilleMaladiesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FamilleMaladiesDetailComponent,
    resolve: {
      familleMaladies: FamilleMaladiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FamilleMaladiesUpdateComponent,
    resolve: {
      familleMaladies: FamilleMaladiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FamilleMaladiesUpdateComponent,
    resolve: {
      familleMaladies: FamilleMaladiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(familleMaladiesRoute)],
  exports: [RouterModule],
})
export class FamilleMaladiesRoutingModule {}
