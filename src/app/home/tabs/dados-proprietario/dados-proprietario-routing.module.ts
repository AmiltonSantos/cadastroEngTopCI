import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DadosProprietarioPage } from './dados-proprietario.page';

const routes: Routes = [
  {
    path: '',
    component: DadosProprietarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DadosProprietarioPageRoutingModule {}
