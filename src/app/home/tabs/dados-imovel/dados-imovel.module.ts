import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DadosImovelPageRoutingModule } from './dados-imovel-routing.module';

import { DadosImovelPage } from './dados-imovel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DadosImovelPageRoutingModule
  ],
  declarations: [DadosImovelPage]
})
export class DadosImovelPageModule {}
