import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { ModalPage } from '../pages/modal/modal';
import { PortService } from '../services/index';

let components = [AppComponent, HomePage, ModalPage];

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  declarations: components,
  entryComponents: components,
  providers: [PortService]
})
export class AppModule { }