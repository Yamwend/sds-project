import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'patients',
        data: { pageTitle: 'sds2App.patients.home.title' },
        loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),
      },
      {
        path: 'traitements',
        data: { pageTitle: 'sds2App.traitements.home.title' },
        loadChildren: () => import('./traitements/traitements.module').then(m => m.TraitementsModule),
      },
      {
        path: 'maladies',
        data: { pageTitle: 'sds2App.maladies.home.title' },
        loadChildren: () => import('./maladies/maladies.module').then(m => m.MaladiesModule),
      },
      {
        path: 'ordonnances',
        data: { pageTitle: 'sds2App.ordonnances.home.title' },
        loadChildren: () => import('./ordonnances/ordonnances.module').then(m => m.OrdonnancesModule),
      },
      {
        path: 'ligne-ordonnances',
        data: { pageTitle: 'sds2App.ligneOrdonnances.home.title' },
        loadChildren: () => import('./ligne-ordonnances/ligne-ordonnances.module').then(m => m.LigneOrdonnancesModule),
      },
      {
        path: 'famille-maladies',
        data: { pageTitle: 'sds2App.familleMaladies.home.title' },
        loadChildren: () => import('./famille-maladies/famille-maladies.module').then(m => m.FamilleMaladiesModule),
      },
      {
        path: 'consultations',
        data: { pageTitle: 'sds2App.consultations.home.title' },
        loadChildren: () => import('./consultations/consultations.module').then(m => m.ConsultationsModule),
      },
      {
        path: 'personnel-soignants',
        data: { pageTitle: 'sds2App.personnelSoignants.home.title' },
        loadChildren: () => import('./personnel-soignants/personnel-soignants.module').then(m => m.PersonnelSoignantsModule),
      },
      {
        path: 'services',
        data: { pageTitle: 'sds2App.services.home.title' },
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
      },
      {
        path: 'laboratoires',
        data: { pageTitle: 'sds2App.laboratoires.home.title' },
        loadChildren: () => import('./laboratoires/laboratoires.module').then(m => m.LaboratoiresModule),
      },
      {
        path: 'examens',
        data: { pageTitle: 'sds2App.examens.home.title' },
        loadChildren: () => import('./examens/examens.module').then(m => m.ExamensModule),
      },
      {
        path: 'type-exams',
        data: { pageTitle: 'sds2App.typeExams.home.title' },
        loadChildren: () => import('./type-exams/type-exams.module').then(m => m.TypeExamsModule),
      },
      {
        path: 'hospitalisations',
        data: { pageTitle: 'sds2App.hospitalisations.home.title' },
        loadChildren: () => import('./hospitalisations/hospitalisations.module').then(m => m.HospitalisationsModule),
      },
      {
        path: 'chambres',
        data: { pageTitle: 'sds2App.chambres.home.title' },
        loadChildren: () => import('./chambres/chambres.module').then(m => m.ChambresModule),
      },
      {
        path: 'categorie-chambres',
        data: { pageTitle: 'sds2App.categorieChambres.home.title' },
        loadChildren: () => import('./categorie-chambres/categorie-chambres.module').then(m => m.CategorieChambresModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
