import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TraitementsComponent } from '../list/traitements.component';
import { TraitementsDetailComponent } from '../detail/traitements-detail.component';
import { TraitementsUpdateComponent } from '../update/traitements-update.component';
import { TraitementsRoutingResolveService } from './traitements-routing-resolve.service';

const traitementsRoute: Routes = [
  {
    path: '',
    component: TraitementsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TraitementsDetailComponent,
    resolve: {
      traitements: TraitementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TraitementsUpdateComponent,
    resolve: {
      traitements: TraitementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TraitementsUpdateComponent,
    resolve: {
      traitements: TraitementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(traitementsRoute)],
  exports: [RouterModule],
})
export class TraitementsRoutingModule {}
