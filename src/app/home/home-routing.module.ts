import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { DadosImovelPage } from './tabs/dados-imovel/dados-imovel.page';
import { DadosProprietarioPage } from './tabs/dados-proprietario/dados-proprietario.page';
import { ImageSavePage } from './tabs/image-save/image-save.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
        {
            path: 'dados-proprietario',
            children: [
                {
                    path: '',
                    component: DadosProprietarioPage
                }
            ]
        },
        {
            path: 'dados-imovel',
            children: [
                {
                    path: '',
                    component: DadosImovelPage
                }
            ]
        },
        {
            path: 'imagem-save',
            children: [
                {
                    path: '',
                    component: ImageSavePage
                }
            ]
        },
        {
          path: '',
          redirectTo: 'dados-proprietario',
          pathMatch: 'full'
      }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
