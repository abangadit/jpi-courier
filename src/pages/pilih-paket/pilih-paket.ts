import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { Login } from '../login/login';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { PreviewPrintPage } from '../preview-print-page/preview-print-page';

import { Myservice } from '../../providers/myservice';
@Component({
  selector: 'page-pilih-paket',
  templateUrl: 'pilih-paket.html',
})
export class PilihPaket {
  data;loader;toast;data_box;token;

  constructor(
    public http: Http,
    public appCtrl: App,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcode: BarcodeScanner,
    public serv: Myservice) {
    this.storage.get('token').then((val) => {
      console.log("token",val);
      this.token = val;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PilihPaket');
  }
  pilih_kilo(){
      this.navCtrl.push(HomePage,{tipe_paket:"kilo"});
  }
  pilih_box(){
    this.navCtrl.push(HomePage,{tipe_paket:"box"});
  }
  select_box(id,name){
    this.data_box = [];
    this.navCtrl.push(HomePage,{tipe_paket:"box",box_id:id,box_name:name});
  }

}
