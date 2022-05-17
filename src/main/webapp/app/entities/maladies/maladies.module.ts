import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MaladiesComponent } from './list/maladies.component';
import { MaladiesDetailComponent } from './detail/maladies-detail.component';
import { MaladiesUpdateComponent } from './update/maladies-update.component';
import { MaladiesDeleteDialogComponent } from './delete/maladies-delete-dialog.component';
import { MaladiesRoutingModule } from './route/maladies-routing.module';

@NgModule({
  imports: [SharedModule, MaladiesRoutingModule],
  declarations: [MaladiesComponent, MaladiesDetailComponent, MaladiesUpdateComponent, MaladiesDeleteDialogComponent],
  entryComponents: [MaladiesDeleteDialogComponent],
})
export class MaladiesModule {}
