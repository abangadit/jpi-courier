import { NotaKotak } from './../nota-kotak/nota-kotak';
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
declare var jQuery: any;

@Component({
  selector: 'page-kotak-kosong',
  templateUrl: 'kotak-kosong.html',
})
export class KotakKosong {
  data;loader;toast;data_box;token;
  name;phone;
  box1 = 0;box2 = 0;box3 = 0;box4 = 0;
  price1=10;price2=12;price3=17;price4=20;
  total = 0;
  boxes  = [];
  prices = [];

  box = ['S','M','L','XL'];
  qty = [0,0,0,0];

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

    jQuery(document).ready(function(){
 
      // Initialize select2
      jQuery("#selUser").select2();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KotakKosong');
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
  kotak_kosong(){
    this.navCtrl.push(HomePage,{tipe_paket:"box"});
  }
  plus(berapa){
    if(berapa=="1"){
      this.box1++;
      this.total += this.price1;
      this.qty[0]++;
    }else if(berapa=="2"){
      this.box2++;
      this.total += this.price2;
      this.qty[1]++;
    }else if(berapa=="3"){
      this.box3++;
      this.total += this.price3;
      this.qty[2]++;
    }else if(berapa=="4"){
      this.box4++;
      this.total += this.price4;
      this.qty[3]++;
    }
  }
  minus(berapa){
    if(berapa=="1"){
      if(this.box1>0){
        this.box1--;this.total -= this.price1;
        this.qty[0]--;
      }
    }else if(berapa=="2"){
      if(this.box2>0){
        this.box2--;this.total -= this.price2;
        this.qty[1]--;
      }
    }else if(berapa=="3"){
      if(this.box3>0){
        this.box3--;this.total -= this.price3;
        this.qty[2]--;
      }
    }else if(berapa=="4"){
      if(this.box4>0){
        this.box4--;this.total -= this.price4;
        this.qty[3]--;
      }
    }
  }
  create_order(){
    console.log(this.box1);
    console.log(this.box2);
    console.log(this.box3);
    console.log(this.box4);
    console.log("=======");
    console.log(this.total);

    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'Public_Api/createkotakkosong';
    let body = new FormData;
    body.append("name",this.name);
    body.append("phone",this.phone);
    body.append("box",this.box.toString());
    body.append("price",this.qty.toString());
    body.append("total",this.total.toString());
    let headers = new Headers();
    headers.append("Authorization",this.token);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(body);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.navCtrl.push(NotaKotak,{
          name:this.name,
          tgl:data.tgl,
          no:data.no,
          phone:this.phone,
          box:this.box,
          price:this.qty,
          total:this.total,
        });
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
        setTimeout(()=>{    //<<<---    using ()=> syntax
        if(this.loader){ this.loader.dismiss(); this.loader = null; }
          alert("Invalid Token");
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
