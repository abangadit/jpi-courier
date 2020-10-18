import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { Login } from '../login/login';
import { DetailOrder } from '../detail-order/detail-order';

import { Myservice } from '../../providers/myservice';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  login_id;login_nama;
  order_id;
  data;loader;toast;
  token;nomor_resi:string;
  private form1: FormGroup;

  constructor(
    private barcodeScanner: BarcodeScanner,
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
    public serv: Myservice
  ) {
    this.form1 = formBuilder.group({
      'no_resi': ['', Validators.required]
    })
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
      this.search_resi(barcodeData.text);
    }).catch(err => {
        console.log('Error', err);
    });
  }
  cari(){
    let formdata = this.form1.value;
    console.log(formdata.no_resi);
    this.search_resi(formdata.no_resi);
  }
  search_resi(resi){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/searchbybarcode';
    let headers = new Headers();
    headers.append("Authorization",this.token);
    let body = new FormData;
    body.append('resi', resi);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.navCtrl.push(DetailOrder,{'order_id':data.list[0].id});
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
        this.storage.clear();
        this.loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
        this.loader.present();
        setTimeout(()=>{    //<<<---    using ()=> syntax
        if(this.loader){ this.loader.dismiss(); this.loader = null; }
          this.appCtrl.getRootNav().setRoot(Login);
        },2200);
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
