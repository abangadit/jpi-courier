import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { Login } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { DialogChangeStatus } from '../dialog-change-status/dialog-change-status';
import { PreviewPrintPage } from '../preview-print-page/preview-print-page';

import { Myservice } from '../../providers/myservice';

@Component({
  selector: 'page-detail-order',
  templateUrl: 'detail-order.html',
})
export class DetailOrder {
  login_id;order_id;
  data;loader;toast;
  token;base_url_image;
  tab = "info";
  jumlah_log = 0;

  resi_id;
  receipt_number;
  order_date;
  last_status;
  pengirim_nama;
  pengirim_tanggal;
  pengirim_telp;
  pengirim_alamat;
  pengirim_kodepos;
  pengirim_provinsi;
  pengirim_kota;
  penerima_tanggal;
  penerima_nama;
  penerima_telp;
  penerima_alamat;
  penerima_kodepos;
  penerima_provinsi;
  penerima_kota;
  ukuran_box;
  jenis_pengiriman;
  container_number;
  tipe_paket;
  weight;

  item;
  tracking;

  telp_alternatif;
  isAgen;
  agen;
  kota_tujuan;
  provinsi_tujuan;
  box_name;
  tambahan;
  harga;
  service_charge;
  berat_total;
  total_harga;

  constructor(
    public http: Http,
    public appCtrl: App,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcode: BarcodeScanner,
    public serv: Myservice) {
    this.base_url_image = this.serv.base_url_image;
    this.order_id = navParams.get("order_id");
    //this.order_id = 1;
    this.storage.get('token').then((val) => {
      this.token = val;
      this.get_detail2(this.order_id);
    });
    this.storage.get('id').then((val) => {
      this.login_id = val;
    });
  }

  get_detail(id){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/detailorder/'+id;
    let body = new FormData;
    let headers = new Headers();
    headers.append("Authorization",this.token);
    //headers.append("Content-Type","application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });
    this.http.get(link, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.resi_id           = data.list[0].id;
        this.receipt_number    = data.list[0].no_resi;
        this.order_date        = data.list[0].datetime;
        this.last_status       = data.list[0].status;
        this.pengirim_nama     = data.list[0].sender_name;
        this.pengirim_tanggal  = "";
        this.pengirim_telp     = data.list[0].sender_phone;
        this.pengirim_alamat   = data.list[0].sender_address+" "+data.list[0].sender_kodepos;
        this.penerima_tanggal  = "";
        this.penerima_nama     = data.list[0].receiver_name;
        this.penerima_telp     = data.list[0].receiver_phone;
        this.penerima_alamat   = data.list[0].receiver_address+" "+data.list[0].receiver_kodepos;

        this.weight            = data.list[0].weight;
        this.tipe_paket        = data.list[0].tipe_paket;
        this.container_number  = data.list[0].container_number;
        this.ukuran_box        = data.list[0].box_size;
        this.jenis_pengiriman  = data.list[0].type_ongkir;

        this.barcode            = data.list[0].no_resi;
        this.telp_alternatif    = data.list[0].telp_alternatif;
        if(data.list[0].agen==0){
          this.isAgen             = false;
          this.agen               = data.list[0].agen;
        }else{
          this.isAgen             = true;
          this.agen               = data.list[0].agen;
        }
        this.kota_tujuan        = data.kota;
        this.provinsi_tujuan    = data.prov;

        this.box_name           = data.list[0].box_size;
        this.tambahan           = data.list[0].tambahan;
        this.harga              = data.list[0].harga_dasar;
        this.service_charge     = data.list[0].service_charge;
        this.berat_total        = data.list[0].weight;
        this.total_harga        = data.list[0].total;

        this.item = data.item;
        this.tracking = data.tracking;
        for(let x = 0;x<data.tracking.length;x++){
          this.jumlah_log += 1;
        }
        this.jumlah_log -= 1;


        //this.change_status();
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
  get_detail2(id){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/detailorder/'+id;
    let body = new FormData;
    let headers = new Headers();
    headers.append("Authorization",this.token);
    //headers.append("Content-Type","application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });
    this.http.get(link, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.resi_id           = data.list[0].id;
        this.receipt_number    = data.list[0].no_resi;
        this.order_date        = data.list[0].datetime;
        this.last_status       = data.list[0].status;
        this.pengirim_nama     = data.list[0].sender_name;
        this.pengirim_tanggal  = "";
        this.pengirim_telp     = data.list[0].sender_phone;
        this.pengirim_alamat   = data.list[0].sender_address+" "+data.list[0].sender_kodepos;
        this.penerima_tanggal  = "";
        this.penerima_nama     = data.list[0].receiver_name;
        this.penerima_telp     = data.list[0].receiver_phone;
        this.penerima_alamat   = data.list[0].receiver_address+" "+data.list[0].receiver_kodepos;

        this.weight            = data.list[0].weight;
        this.tipe_paket        = data.list[0].tipe_paket;
        this.container_number  = data.list[0].container_number;
        this.ukuran_box        = data.list[0].box_size;
        this.jenis_pengiriman  = data.list[0].type_ongkir;

        this.barcode            = data.list[0].no_resi;
        this.telp_alternatif    = data.list[0].telp_alternatif;
        if(data.list[0].agen==0){
          this.isAgen             = false;
          this.agen               = data.list[0].agen;
        }else{
          this.isAgen             = true;
          this.agen               = data.list[0].agen;
        }
        this.kota_tujuan        = data.kota;
        this.provinsi_tujuan    = data.prov;

        this.box_name           = data.list[0].box_size;
        this.tambahan           = data.list[0].tambahan;
        this.harga              = data.list[0].harga_dasar;
        this.service_charge     = data.list[0].service_charge;
        this.berat_total        = data.list[0].weight;
        this.total_harga        = data.list[0].total;

        this.item = data.item;
        this.tracking = data.tracking;
        for(let x = 0;x<data.tracking.length;x++){
          this.jumlah_log += 1;
        }
        this.jumlah_log -= 1;


        this.change_status();
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
  cetak_nota(){
    let param = {
      barcode:this.barcode,
      pengirim:this.pengirim_nama,
      tanggal:this.pengirim_tanggal,
      penerima:this.penerima_nama,
      ukuran_box:this.ukuran_box,
      servis:this.jenis_pengiriman,
      alamat_tujuan:this.penerima_alamat,
      total:this.total_harga,
      pengirim_telp:this.pengirim_telp,
      penerima_telp:this.penerima_telp,
      berat_total:this.berat_total,
      service_charge:this.service_charge,
      harga:this.harga,
      tambahan:this.tambahan,
      tipe_paket:this.tipe_paket,
      box_name:this.box_name,
      provinsi_tujuan:this.provinsi_tujuan,
      kota_tujuan:this.kota_tujuan,
      isAgen:this.isAgen,
      telp_alternatif:this.telp_alternatif
    };
    this.navCtrl.push(PreviewPrintPage,param);
  }
  change_status(){
    console.log("1 "+this.receipt_number);
    let profileModal = this.modalCtrl.create(DialogChangeStatus, { resi_id: this.resi_id,resi:this.receipt_number, last_status: this.last_status });
        profileModal.onDidDismiss(data => {
          console.log(data);
          this.get_detail(this.order_id);
          if(data.status=="DELIVERED"){
            this.navCtrl.pop();
          }
          //this.navCtrl.pop();
        });
        profileModal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailOrder');
  }

}
