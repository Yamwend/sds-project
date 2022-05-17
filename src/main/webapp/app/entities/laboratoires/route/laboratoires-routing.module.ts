import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LaboratoiresComponent } from '../list/laboratoires.component';
import { LaboratoiresDetailComponent } from '../detail/laboratoires-detail.component';
import { LaboratoiresUpdateComponent } from '../update/laboratoires-update.component';
import { LaboratoiresRoutingResolveService } from './laboratoires-routing-resolve.service';

const laboratoiresRoute: Routes = [
  {
    path: '',
    component: LaboratoiresComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LaboratoiresDetailComponent,
    resolve: {
      laboratoires: LaboratoiresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LaboratoiresUpdateComponent,
    resolve: {
      laboratoires: LaboratoiresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LaboratoiresUpdateComponent,
    resolve: {
      laboratoires: LaboratoiresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(laboratoiresRoute)],
  exports: [RouterModule],
})
export class LaboratoiresRoutingModule {}
