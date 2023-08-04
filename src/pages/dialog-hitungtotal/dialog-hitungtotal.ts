import { Component, Renderer } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController,AlertController,Platform,MenuController, ActionSheetController } from 'ionic-angular';
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

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var jQuery: any;
declare var cordova: any;

@Component({
  selector: 'page-dialog-hitungtotal',
  templateUrl: 'dialog-hitungtotal.html',
})
export class DialogHitungtotal {
  resi_id;
  login_id;order_id;
  data;loader;toast;
  token;status;detail;
  selected_agen;agen;
  total;total_string;
  service_charge = 0;
  tambahan = 0;
  total_all = 0;

  //field form//
  obj;
  tipe_paket;box_id;box_name;
  pengirim_negara;
  pengirim_tanggal;
  pengirim_nama;
  pengirim_telp;
  pengirim_alamat;
  pengirim_kodepos;
  pengirim_provinsi;
  pengirim_kota;
  pengirim_passport;

  penerima_negara;
  penerima_tanggal;
  penerima_nama;
  penerima_telp;
  penerima_alamat;
  penerima_kodepos;
  penerima_provinsi;
  penerima_kota;

  provinsi_tujuan;
  kota_tujuan;

  telp_alternatif;

  harga;
  berat_total;
  ukuran_box;
  jenis_pengiriman;

  isAgen = false;
  param;

  komisi;non_size = "";

  public unregisterBackButtonAction: any;
  panjang;lebar;tinggi;

  bukti1;bukti2;

  packing = 0;
  packing_price = 0;
  packing_name;

  agen_name;
  kilogram;

  constructor(
    public http: Http,
    public appCtrl: App,
    private storage: Storage,
    public renderer: Renderer,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcode: BarcodeScanner,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    public platform: Platform,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public serv: Myservice) {

    var head = this;

    this.resi_id = navParams.get('resi_id');
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);

    this.storage.get('token').then((val) => {
      this.token = val;
      this.storage.get('id').then((val) => {
        this.login_id = val;
        this.get_agen();
      });
    });

    this.total = this.navParams.get("total");
    this.harga = this.navParams.get("total");
    this.obj = this.navParams.get("obj");
    this.tipe_paket = this.navParams.get("tipe_paket");
    this.box_id = this.navParams.get("box_id");
    this.box_name = this.navParams.get("box_name");
    this.berat_total = this.navParams.get("berat_total");

    this.jenis_pengiriman = this.navParams.get("jenis_pengiriman");
    this.pengirim_tanggal = this.navParams.get("pengirim_tanggal");
    this.pengirim_nama = this.navParams.get("pengirim_nama");
    this.pengirim_telp = this.navParams.get("pengirim_telp");
    this.pengirim_alamat = this.navParams.get("pengirim_alamat");
    this.pengirim_kodepos = this.navParams.get("pengirim_kodepos");
    this.pengirim_negara = this.navParams.get("pengirim_negara");
    this.pengirim_provinsi = this.navParams.get("pengirim_provinsi");
    this.pengirim_kota = this.navParams.get("pengirim_kota");
    this.pengirim_passport = this.navParams.get("pengirim_passport");

    this.penerima_tanggal = this.navParams.get("penerima_tanggal");
    this.penerima_nama = this.navParams.get("penerima_nama");
    this.penerima_telp = this.navParams.get("penerima_telp");
    this.penerima_alamat = this.navParams.get("penerima_alamat");
    this.penerima_kodepos = this.navParams.get("penerima_kodepos");
    this.penerima_negara = this.navParams.get("penerima_negara");
    this.penerima_provinsi = this.navParams.get("penerima_provinsi");
    this.penerima_kota = this.navParams.get("penerima_kota");

    this.provinsi_tujuan = navParams.get("provinsi_tujuan");
    this.kota_tujuan = navParams.get("kota_tujuan");

    this.telp_alternatif = this.navParams.get("telp_alternatif");
    this.komisi = this.navParams.get("komisi");
    this.non_size = this.navParams.get("non_size");

    this.panjang = this.navParams.get("panjang");
    this.lebar = this.navParams.get("lebar");
    this.tinggi = this.navParams.get("tinggi");

    this.bukti1 = this.navParams.get("image_1");
    this.bukti2 = this.navParams.get("image_2");

    var pak             = this.navParams.get("packing");
    this.kilogram       = this.navParams.get("kilogram");
    console.log("navParams");
    console.log(this.navParams);
    console.log("komisi");
    console.log(this.komisi);
    console.log(this.navParams.data['komisi']);
    this.packing        = pak.split("#")[0];
    this.packing_name   = pak.split("#")[1];
    this.packing_price  = pak.split("#")[2];


    jQuery(document).ready(function(){
      
      // Initialize select2
      jQuery("#selUser").select2({ dropdownCssClass: "myFont" }).on("change", function (e) {
        var str = jQuery("#selUser .select2-choice span").text();
        console.log(this.value)
        head.selected_agen = this.value;
        console.log(e)
        console.log("komisi");
        console.log(head.komisi)
        //console.log(str);
        head.isAgen = true;
        //head.service_charge = (head.komisi);
      })
    });

    //this.service_charge = (25/100)*this.navParams.get("total");

    console.log("================");
    console.log(this.non_size);
    console.log("================");

    setTimeout(()=>{    //<<<---    using ()=> syntax
    if(this.loader){ this.loader.dismiss(); this.loader = null; }
      this.total_all = parseInt(this.total)+parseInt(this.packing_price.toString())+parseInt(this.service_charge.toString())+parseInt(this.tambahan.toString());
      if(this.non_size!=""){
        this.total = 0;
        this.service_charge = 0;
        this.tambahan = 0;
        this.total_all = 0;
      }
    },1000);
  }
  hitung(val) {
   console.log("hitung"+val);
   if(val)
   //this.total_all = this.tambahan+parseInt(val);
   this.total_all = parseInt(this.packing_price.toString())+parseInt(this.service_charge.toString())+parseInt(this.tambahan.toString());

   this.total_all += parseFloat(val);


  }
  hitung1(val) {
   console.log("hitung 1"+val);
   if(val)
   //this.total_all = parseInt(this.total)+parseInt(val);
   this.total_all = parseInt(this.total)+parseInt(this.packing_price.toString())+parseInt(this.service_charge.toString());

   this.total_all += parseFloat(val);
  }
  hitung2(val) {
   console.log("hitung 2"+val);
   if(val)
   this.total_all = parseInt(this.total)+parseInt(this.packing_price.toString())+parseInt(this.tambahan.toString());

   this.total_all += parseInt(val);
  }
  setKomisi(val){
    this.isAgen = true;
    console.log(val);
    console.log(this.isAgen);
    this.agen_name = this.get_id(this.agen,val);
    //this.service_charge = parseInt(this.komisi);
    //this.total = parseInt(this.total) - this.service_charge;
    //this.total_all = parseInt(this.total)+this.tambahan+this.service_charge;
  }
  get_agen(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/t_agen';
    let body = new FormData;
    let headers = new Headers();
    headers.append("Authorization",this.token);
    headers.append("Content-Type","application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });
    this.http.get(link, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.agen = data.data;
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
  get_id(obj,id){
    for(let x = 0;x<obj.length;x++){
      if(obj[x].id==id){
        return x;
      }
    }
  }
  wait(){
    let agen = this.get_id(this.agen,this.selected_agen);
    console.log(agen);
    console.log(this.agen);
    console.log(this.selected_agen);
  }
  confirm_order(){
    const alert = this.alertCtrl.create({
      title: 'Confirm Order',
      message: 'Create Order ?',
      buttons: [{
          text: 'No',
          handler: () => {

          }
      },{
        text: 'Yes',
        role: 'yes',
        handler: () => {
            //this.process_create_order_debug();
            this.process_create_order();
        }
    }]
  });
  alert.present();
  }
  process_create_order_debug(){
    let agen = this.get_id(this.agen,this.selected_agen);
    var valueToPush = { };
    valueToPush["login_id"] = this.login_id;
    valueToPush["pengirim_tanggal"] = this.pengirim_tanggal;
    valueToPush['pengirim_nama'] =  this.pengirim_nama;
    valueToPush['pengirim_negara'] =  this.pengirim_negara;
    valueToPush['pengirim_provinsi'] =  this.pengirim_provinsi;
    valueToPush['pengirim_kota'] =  this.pengirim_kota;
    valueToPush['pengirim_kodepos'] =  this.pengirim_kodepos;
    valueToPush['pengirim_alamat'] =  this.pengirim_alamat;
    valueToPush['pengirim_telp'] =  this.pengirim_telp;
    valueToPush['pengirim_passport'] = this.pengirim_passport;

    valueToPush['penerima_tanggal'] =  this.penerima_tanggal;
    valueToPush['penerima_nama'] =  this.penerima_nama;
    valueToPush['penerima_kodepos'] =  this.penerima_kodepos;
    valueToPush['penerima_alamat'] =  this.penerima_alamat;
    valueToPush['penerima_telp'] =  this.penerima_telp;
    valueToPush['penerima_negara'] =  this.penerima_negara;
    valueToPush['penerima_provinsi'] =  this.penerima_provinsi;
    valueToPush['penerima_kota'] =  this.penerima_kota;

    valueToPush['telp_alternatif'] = this.telp_alternatif;
    valueToPush['ukuran_box'] =  this.box_id;
    valueToPush['jenis_pengiriman'] =  this.jenis_pengiriman;
    valueToPush['berat_total'] = this.berat_total;
    valueToPush['tipe_paket'] = this.tipe_paket;
    valueToPush['service_charge'] = this.service_charge.toString();
    valueToPush['tambahan'] = this.tambahan.toString();
    valueToPush['agen'] = this.selected_agen;
    valueToPush['agenx'] = this.agen[agen].kode;
    valueToPush['isAgen'] = this.isAgen;
    valueToPush['komisi'] = this.komisi;

    valueToPush['packing']        = this.packing;
    valueToPush['packing_name']   = this.packing_name;
    valueToPush['packing_price']  = this.packing_price;
    if(this.tipe_paket=="box"){
      valueToPush['box_id'] = this.box_id;
      valueToPush['non_size'] = this.non_size;
      valueToPush['non_size_total'] = this.total_all.toString();
    }
    valueToPush['item'] =  JSON.stringify(this.obj);

    console.log(valueToPush);
  }
  process_create_order(){
    let agen = this.get_id(this.agen,this.selected_agen);
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata2/createorder';
    let body = new FormData;
    body.append("login_id",this.login_id);
    body.append("pengirim_tanggal",this.pengirim_tanggal);
    body.append('pengirim_nama', this.pengirim_nama);
    body.append('pengirim_negara', this.pengirim_negara);
    body.append('pengirim_provinsi', this.pengirim_provinsi);
    body.append('pengirim_kota', this.pengirim_kota);
    body.append('pengirim_kodepos', this.pengirim_kodepos);
    body.append('pengirim_alamat', this.pengirim_alamat);
    body.append('pengirim_telp', this.pengirim_telp);
    body.append('pengirim_passport',this.pengirim_passport);

    body.append('penerima_tanggal', this.penerima_tanggal);
    body.append('penerima_nama', this.penerima_nama);
    body.append('penerima_kodepos', this.penerima_kodepos);
    body.append('penerima_alamat', this.penerima_alamat);
    body.append('penerima_telp', this.penerima_telp);
    body.append('penerima_negara', this.penerima_negara);
    body.append('penerima_provinsi', this.penerima_provinsi);
    body.append('penerima_kota', this.penerima_kota);

    body.append('telp_alternatif',this.telp_alternatif);
    body.append('ukuran_box', this.box_id);
    body.append('jenis_pengiriman', this.jenis_pengiriman);
    body.append('berat_total',this.berat_total);
    body.append('tipe_paket',this.tipe_paket);
    body.append('service_charge',this.service_charge.toString());
    body.append('tambahan',this.tambahan.toString());
    body.append('agen',this.selected_agen);
    body.append('komisi',this.komisi);
    if(this.tipe_paket=="box"){
      body.append('box_id',this.box_id);
      body.append('non_size',this.non_size);
      body.append('non_size_total',this.total_all.toString());

      body.append('panjang',this.panjang);
      body.append('lebar',this.lebar);
      body.append('tinggi',this.tinggi);
    }
    body.append('item', JSON.stringify(this.obj));

    body.append('image_1',this.bukti1);
    body.append('image_2',this.bukti2);

    body.append('packing',this.packing.toString());
    body.append('packing_name',this.packing_name);
    body.append('packing_price',this.packing_price.toString());
    body.append('kilogram',this.kilogram.toString());

    let headers = new Headers();
    headers.append("Authorization",this.token);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        //alert("Order Berhasil Dibuat");
        if(this.non_size!=""){
          this.harga = this.total;
          data.total_harga = this.total_all;
        }

        if(!this.isAgen){
          this.param = {
            pengirim_nama: this.pengirim_nama,
            pengirim_negara: this.pengirim_negara,
            pengirim_provinsi: this.pengirim_provinsi,
            pengirim_kota: this.pengirim_kota,
            pengirim_kodepos: this.pengirim_kodepos,
            pengirim_alamat: this.pengirim_alamat,
            pengirim_telp:this.pengirim_telp,
            pengirim_passport:this.pengirim_passport,

            penerima_tanggal: this.penerima_tanggal,
            penerima_nama: this.penerima_nama,
            penerima_alamat: this.penerima_alamat,
            penerima_negara: this.penerima_negara,
            penerima_provinsi: this.penerima_provinsi,
            penerima_kota: this.penerima_kota,
            penerima_telp:this.penerima_telp,

            barcode:data.barcode,
            pengirim:this.pengirim_nama,
            tanggal:data.pengirim_tanggal,
            penerima:this.penerima_nama,
            ukuran_box:this.ukuran_box,
            servis:this.jenis_pengiriman,
            alamat_tujuan:this.penerima_alamat,
            total:data.total_harga,
            berat_total:this.berat_total,
            service_charge:this.service_charge.toString(),
            harga:this.harga,
            tambahan:this.tambahan,
            tipe_paket:this.tipe_paket,
            box_name:data.box_name,
            provinsi_tujuan:this.provinsi_tujuan,
            kota_tujuan:this.kota_tujuan,
            isAgen:this.isAgen,
            telp_alternatif:this.telp_alternatif,
            non_size:this.non_size,

            packing:this.packing,
            packing_name:this.packing_name,
            packing_price:this.packing_price,
          };
        }else{
          this.param = {
            pengirim_nama: this.pengirim_nama,
            pengirim_negara: this.pengirim_negara,
            pengirim_provinsi: this.pengirim_provinsi,
            pengirim_kota: this.pengirim_kota,
            pengirim_kodepos: this.pengirim_kodepos,
            pengirim_alamat: this.pengirim_alamat,
            pengirim_telp:this.pengirim_telp,
            pengirim_passport:this.pengirim_passport,

            penerima_tanggal: this.penerima_tanggal,
            penerima_nama: this.penerima_nama,
            penerima_alamat: this.penerima_alamat,
            penerima_negara: this.penerima_negara,
            penerima_provinsi: this.penerima_provinsi,
            penerima_kota: this.penerima_kota,
            penerima_telp:this.penerima_telp,

            barcode:data.barcode,
            pengirim:this.pengirim_nama,
            tanggal:data.pengirim_tanggal,
            penerima:this.penerima_nama,
            ukuran_box:this.ukuran_box,
            servis:this.jenis_pengiriman,
            alamat_tujuan:this.penerima_alamat,
            total:data.total_harga,
            berat_total:this.berat_total,
            service_charge:this.service_charge.toString(),
            harga:this.harga,
            tambahan:this.tambahan,
            tipe_paket:this.tipe_paket,
            box_name:data.box_name,
            provinsi_tujuan:this.provinsi_tujuan,
            kota_tujuan:this.kota_tujuan,
            agen:this.agen[agen].kode,
            isAgen:this.isAgen,
            telp_alternatif:this.telp_alternatif,
            non_size:this.non_size,

            packing:this.packing,
            packing_name:this.packing_name,
            packing_price:this.packing_price,
          };
        }

        this.navCtrl.push(PreviewPrintPage,this.param);
      }else{
        alert(data.message);
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
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
  }
  ionViewWillLeave() {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }
  initializeBackButtonCustomHandler(): void {
    let self = this;
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
        console.log('Prevent Back Button Page Change');
        self.navCtrl.pop();
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  }

}
