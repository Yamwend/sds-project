import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExamensComponent } from '../list/examens.component';
import { ExamensDetailComponent } from '../detail/examens-detail.component';
import { ExamensUpdateComponent } from '../update/examens-update.component';
import { ExamensRoutingResolveService } from './examens-routing-resolve.service';

const examensRoute: Routes = [
  {
    path: '',
    component: ExamensComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExamensDetailComponent,
    resolve: {
      examens: ExamensRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExamensUpdateComponent,
    resolve: {
      examens: ExamensRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExamensUpdateComponent,
    resolve: {
      examens: ExamensRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(examensRoute)],
  exports: [RouterModule],
})
export class ExamensRoutingModule {}
