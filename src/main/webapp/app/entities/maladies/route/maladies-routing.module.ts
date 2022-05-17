import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MaladiesComponent } from '../list/maladies.component';
import { MaladiesDetailComponent } from '../detail/maladies-detail.component';
import { MaladiesUpdateComponent } from '../update/maladies-update.component';
import { MaladiesRoutingResolveService } from './maladies-routing-resolve.service';

const maladiesRoute: Routes = [
  {
    path: '',
    component: MaladiesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MaladiesDetailComponent,
    resolve: {
      maladies: MaladiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MaladiesUpdateComponent,
    resolve: {
      maladies: MaladiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MaladiesUpdateComponent,
    resolve: {
      maladies: MaladiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(maladiesRoute)],
  exports: [RouterModule],
})
export class MaladiesRoutingModule {}
