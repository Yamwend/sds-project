import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChambresComponent } from '../list/chambres.component';
import { ChambresDetailComponent } from '../detail/chambres-detail.component';
import { ChambresUpdateComponent } from '../update/chambres-update.component';
import { ChambresRoutingResolveService } from './chambres-routing-resolve.service';

const chambresRoute: Routes = [
  {
    path: '',
    component: ChambresComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChambresDetailComponent,
    resolve: {
      chambres: ChambresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChambresUpdateComponent,
    resolve: {
      chambres: ChambresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChambresUpdateComponent,
    resolve: {
      chambres: ChambresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chambresRoute)],
  exports: [RouterModule],
})
export class ChambresRoutingModule {}
