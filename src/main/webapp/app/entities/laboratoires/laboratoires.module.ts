import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LaboratoiresComponent } from './list/laboratoires.component';
import { LaboratoiresDetailComponent } from './detail/laboratoires-detail.component';
import { LaboratoiresUpdateComponent } from './update/laboratoires-update.component';
import { LaboratoiresDeleteDialogComponent } from './delete/laboratoires-delete-dialog.component';
import { LaboratoiresRoutingModule } from './route/laboratoires-routing.module';

@NgModule({
  imports: [SharedModule, LaboratoiresRoutingModule],
  declarations: [LaboratoiresComponent, LaboratoiresDetailComponent, LaboratoiresUpdateComponent, LaboratoiresDeleteDialogComponent],
  entryComponents: [LaboratoiresDeleteDialogComponent],
})
export class LaboratoiresModule {}
