import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ImageSavePageRoutingModule } from './image-save-routing.module';

import { ImageSavePage } from './image-save.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageSavePageRoutingModule
  ],
  declarations: [ImageSavePage]
})
export class ImageSavePageModule {}
