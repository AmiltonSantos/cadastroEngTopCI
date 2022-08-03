import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DadosImovelPage } from './dados-imovel.page';

const routes: Routes = [
  {
    path: '',
    component: DadosImovelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DadosImovelPageRoutingModule {}
