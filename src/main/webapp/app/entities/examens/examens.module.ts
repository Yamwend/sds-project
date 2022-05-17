import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExamensComponent } from './list/examens.component';
import { ExamensDetailComponent } from './detail/examens-detail.component';
import { ExamensUpdateComponent } from './update/examens-update.component';
import { ExamensDeleteDialogComponent } from './delete/examens-delete-dialog.component';
import { ExamensRoutingModule } from './route/examens-routing.module';

@NgModule({
  imports: [SharedModule, ExamensRoutingModule],
  declarations: [ExamensComponent, ExamensDetailComponent, ExamensUpdateComponent, ExamensDeleteDialogComponent],
  entryComponents: [ExamensDeleteDialogComponent],
})
export class ExamensModule {}
