import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DadosProprietarioPageRoutingModule } from './dados-proprietario-routing.module';

import { DadosProprietarioPage } from './dados-proprietario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DadosProprietarioPageRoutingModule
  ],
  declarations: [DadosProprietarioPage]
})
export class DadosProprietarioPageModule {}
