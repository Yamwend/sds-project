import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChambresComponent } from './list/chambres.component';
import { ChambresDetailComponent } from './detail/chambres-detail.component';
import { ChambresUpdateComponent } from './update/chambres-update.component';
import { ChambresDeleteDialogComponent } from './delete/chambres-delete-dialog.component';
import { ChambresRoutingModule } from './route/chambres-routing.module';

@NgModule({
  imports: [SharedModule, ChambresRoutingModule],
  declarations: [ChambresComponent, ChambresDetailComponent, ChambresUpdateComponent, ChambresDeleteDialogComponent],
  entryComponents: [ChambresDeleteDialogComponent],
})
export class ChambresModule {}
