import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PersonnelSoignantsComponent } from '../list/personnel-soignants.component';
import { PersonnelSoignantsDetailComponent } from '../detail/personnel-soignants-detail.component';
import { PersonnelSoignantsUpdateComponent } from '../update/personnel-soignants-update.component';
import { PersonnelSoignantsRoutingResolveService } from './personnel-soignants-routing-resolve.service';

const personnelSoignantsRoute: Routes = [
  {
    path: '',
    component: PersonnelSoignantsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonnelSoignantsDetailComponent,
    resolve: {
      personnelSoignants: PersonnelSoignantsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonnelSoignantsUpdateComponent,
    resolve: {
      personnelSoignants: PersonnelSoignantsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonnelSoignantsUpdateComponent,
    resolve: {
      personnelSoignants: PersonnelSoignantsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(personnelSoignantsRoute)],
  exports: [RouterModule],
})
export class PersonnelSoignantsRoutingModule {}
