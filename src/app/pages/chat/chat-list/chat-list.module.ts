// src/app/pages/chat-list/chat-list.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ChatListPage } from './chat-list.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChatListPage
      }
    ])
  ],
})
export class ChatListPageModule {}