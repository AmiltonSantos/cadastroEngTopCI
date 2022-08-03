import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageSavePage } from './image-save.page';

const routes: Routes = [
  {
    path: '',
    component: ImageSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageSavePageRoutingModule {}
