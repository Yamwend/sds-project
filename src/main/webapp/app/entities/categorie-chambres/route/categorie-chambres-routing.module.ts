import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CategorieChambresComponent } from '../list/categorie-chambres.component';
import { CategorieChambresDetailComponent } from '../detail/categorie-chambres-detail.component';
import { CategorieChambresUpdateComponent } from '../update/categorie-chambres-update.component';
import { CategorieChambresRoutingResolveService } from './categorie-chambres-routing-resolve.service';

const categorieChambresRoute: Routes = [
  {
    path: '',
    component: CategorieChambresComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CategorieChambresDetailComponent,
    resolve: {
      categorieChambres: CategorieChambresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CategorieChambresUpdateComponent,
    resolve: {
      categorieChambres: CategorieChambresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CategorieChambresUpdateComponent,
    resolve: {
      categorieChambres: CategorieChambresRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(categorieChambresRoute)],
  exports: [RouterModule],
})
export class CategorieChambresRoutingModule {}
