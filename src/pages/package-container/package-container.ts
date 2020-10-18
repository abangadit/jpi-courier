import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { Login } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { PreviewPrintPage } from '../preview-print-page/preview-print-page';

import { Myservice } from '../../providers/myservice';
@Component({
  selector: 'page-package-container',
  templateUrl: 'package-container.html',
})
export class PackageContainer {
  login_id;login_nama;
  order_id;
  data;loader;toast;
  token;
  container_number;nomor_resi;

  constructor(
    public http: Http,
    public appCtrl: App,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcode: BarcodeScanner,
    public serv: Myservice) {
    this.storage.get('id').then((val) => {
      this.login_id = val;
    });
    this.storage.get('token').then((val) => {
      this.token = val;
    });
    this.storage.get('nama').then((val) => {
      this.login_nama = val;
    });
  }
  ionViewDidEnter(){
    this.storage.get('nama').then((val) => {
      this.login_nama = val;
    });
  }
  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
    console.log('Barcode data', barcodeData);
      if(barcodeData.toString()=="" || barcodeData.toString()==" " || barcodeData==null || typeof barcodeData==undefined){
        alert("Please Scan Barcode");
      }else{
        if(typeof this.container_number == undefined || this.container_number=="" || this.container_number==" " || this.container_number==undefined){
          alert("Package Number Cannot Be Empty !");
        }else{
          this.updatecontainer(barcodeData.text);
        }
      }

    }).catch(err => {
        console.log('Error', err);
        alert("Please Scan Barcode");
    });
  }
  cari(){
    if(typeof this.container_number == undefined || this.container_number=="" || this.container_number==" " || this.container_number==undefined){
      alert("Package Number Cannot Be Empty !");
    }else{
      this.updatecontainer(this.nomor_resi);
    }
  }
  updatecontainer(no_resi){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/updatecontainer';
    let headers = new Headers();
    headers.append("Authorization",this.token);
    let body = new FormData;
    body.append('login_id', this.login_id);
    body.append('no_resi', no_resi);
    body.append('container_number', this.container_number);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.toast = this.toastCtrl.create({
          message: data.message,
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 3000
        });
        this.toast.present();
      }else{
        this.toast = this.toastCtrl.create({
          message: data.message,
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 3000
        });
        this.toast.present();
      }
    }, error => {
    if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(error.status!=200){
        //this.storage.clear();
        this.loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
        this.loader.present();
        let err = JSON.parse(error._body);
        console.log("error",err);
        this.toast = this.toastCtrl.create({
          message: err.message,
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 3000
        });
        this.toast.present();
        console.log("Oooops!");
      }else{
        let err = JSON.parse(error._body);
        console.log("error",err);
        this.toast = this.toastCtrl.create({
          message: err.message,
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 3000
        });
        this.toast.present();
        console.log("Oooops!");
      }

    });
  }

}
