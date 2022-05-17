import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LigneOrdonnancesComponent } from '../list/ligne-ordonnances.component';
import { LigneOrdonnancesDetailComponent } from '../detail/ligne-ordonnances-detail.component';
import { LigneOrdonnancesUpdateComponent } from '../update/ligne-ordonnances-update.component';
import { LigneOrdonnancesRoutingResolveService } from './ligne-ordonnances-routing-resolve.service';

const ligneOrdonnancesRoute: Routes = [
  {
    path: '',
    component: LigneOrdonnancesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LigneOrdonnancesDetailComponent,
    resolve: {
      ligneOrdonnances: LigneOrdonnancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LigneOrdonnancesUpdateComponent,
    resolve: {
      ligneOrdonnances: LigneOrdonnancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LigneOrdonnancesUpdateComponent,
    resolve: {
      ligneOrdonnances: LigneOrdonnancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ligneOrdonnancesRoute)],
  exports: [RouterModule],
})
export class LigneOrdonnancesRoutingModule {}
