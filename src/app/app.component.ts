import { Component } from '@angular/core';
import { App, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { Login } from '../pages/login/login';
import { Splashscreen } from '../pages/splashscreen/splashscreen';
import { TabsPage } from '../pages/tabs/tabs';
import { DetailOrder } from '../pages/detail-order/detail-order';
import { PreviewPrintPage } from '../pages/preview-print-page/preview-print-page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Splashscreen;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public  app: App,
    public alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      platform.registerBackButtonAction(() => {

            let nav = app.getActiveNavs()[0];
            let activeView = nav.getActive();

            if (nav.canGoBack()){ //Can we go back?
                nav.pop();
            } else{
              const alert = this.alertCtrl.create({
                  title: 'App termination',
                  message: 'Do you want to close the app?',
                  buttons: [{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                          console.log('Application exit prevented!');
                      }
                  },{
                      text: 'Close App',
                      handler: () => {
                          this.platform.exitApp(); // Close this application
                      }
                  }]
              });
              alert.present();
            }
        });

    });
  }
}
