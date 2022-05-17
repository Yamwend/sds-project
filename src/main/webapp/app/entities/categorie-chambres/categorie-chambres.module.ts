import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategorieChambresComponent } from './list/categorie-chambres.component';
import { CategorieChambresDetailComponent } from './detail/categorie-chambres-detail.component';
import { CategorieChambresUpdateComponent } from './update/categorie-chambres-update.component';
import { CategorieChambresDeleteDialogComponent } from './delete/categorie-chambres-delete-dialog.component';
import { CategorieChambresRoutingModule } from './route/categorie-chambres-routing.module';

@NgModule({
  imports: [SharedModule, CategorieChambresRoutingModule],
  declarations: [
    CategorieChambresComponent,
    CategorieChambresDetailComponent,
    CategorieChambresUpdateComponent,
    CategorieChambresDeleteDialogComponent,
  ],
  entryComponents: [CategorieChambresDeleteDialogComponent],
})
export class CategorieChambresModule {}
