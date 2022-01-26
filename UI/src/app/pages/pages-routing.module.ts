import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralLayoutComponent } from '../shared/general-layout/general-layout.component';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { CategoryAnalysisComponent } from './category-analysis/category-analysis.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PredictionsComponent } from './predictions/predictions.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    children: [
      { path: 'home', component: MainPageComponent },
      { path: 'all-transactions', component: AllTransactionsComponent },
      { path: 'predictions', component: PredictionsComponent },
      { path: 'category-analysis', component: CategoryAnalysisComponent }
    ]
  },
  {path: '', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
