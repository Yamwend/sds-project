import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeExamsComponent } from '../list/type-exams.component';
import { TypeExamsDetailComponent } from '../detail/type-exams-detail.component';
import { TypeExamsUpdateComponent } from '../update/type-exams-update.component';
import { TypeExamsRoutingResolveService } from './type-exams-routing-resolve.service';

const typeExamsRoute: Routes = [
  {
    path: '',
    component: TypeExamsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeExamsDetailComponent,
    resolve: {
      typeExams: TypeExamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeExamsUpdateComponent,
    resolve: {
      typeExams: TypeExamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeExamsUpdateComponent,
    resolve: {
      typeExams: TypeExamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeExamsRoute)],
  exports: [RouterModule],
})
export class TypeExamsRoutingModule {}
