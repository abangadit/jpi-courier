import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { TabsPage } from '../tabs/tabs';
import { Login } from '../login/login';
import { Myservice } from '../../providers/myservice';

@Component({
  selector: 'page-splashscreen',
  templateUrl: 'splashscreen.html',
})
export class Splashscreen {
  data;loader;toast;
  fcm_token;

  constructor(
    public http: Http,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public serv: Myservice) {
    setTimeout(()=>{
      this.checkLoginState();
    },1000);

  }

  checkLoginState(){
    this.storage.get('jasapaketindonesia_login_state').then((val) => {
      console.log('Your age is', val);
      if(val!=null && typeof val != undefined){
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.navCtrl.setRoot(Login);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Splashscreen');
  }

}
