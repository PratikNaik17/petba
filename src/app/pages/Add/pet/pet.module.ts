import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetPageRoutingModule } from './pet-routing.module';

import { PetPage } from './pet.page';
import { ImageViewModule } from 'src/app/components/image-viewer/image-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetPageRoutingModule,ImageViewModule
  ],
  declarations: [PetPage]
})
export class PetPageModule {}
