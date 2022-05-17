import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TraitementsComponent } from './list/traitements.component';
import { TraitementsDetailComponent } from './detail/traitements-detail.component';
import { TraitementsUpdateComponent } from './update/traitements-update.component';
import { TraitementsDeleteDialogComponent } from './delete/traitements-delete-dialog.component';
import { TraitementsRoutingModule } from './route/traitements-routing.module';

@NgModule({
  imports: [SharedModule, TraitementsRoutingModule],
  declarations: [TraitementsComponent, TraitementsDetailComponent, TraitementsUpdateComponent, TraitementsDeleteDialogComponent],
  entryComponents: [TraitementsDeleteDialogComponent],
})
export class TraitementsModule {}
