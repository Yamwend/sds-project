import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeExamsComponent } from './list/type-exams.component';
import { TypeExamsDetailComponent } from './detail/type-exams-detail.component';
import { TypeExamsUpdateComponent } from './update/type-exams-update.component';
import { TypeExamsDeleteDialogComponent } from './delete/type-exams-delete-dialog.component';
import { TypeExamsRoutingModule } from './route/type-exams-routing.module';

@NgModule({
  imports: [SharedModule, TypeExamsRoutingModule],
  declarations: [TypeExamsComponent, TypeExamsDetailComponent, TypeExamsUpdateComponent, TypeExamsDeleteDialogComponent],
  entryComponents: [TypeExamsDeleteDialogComponent],
})
export class TypeExamsModule {}
