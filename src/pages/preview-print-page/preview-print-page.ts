import { Component,NgZone } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Http,Headers,RequestOptions } from '@angular/http';
import { Base64 } from '@ionic-native/base64';
import { HTTP } from '@ionic-native/http';
import { File } from '@ionic-native/file';
import 'rxjs/Rx';

import { Login } from '../login/login';
import { PilihPaket } from '../pilih-paket/pilih-paket';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';

import { PrinterService } from "../../providers/printerservice";
import { Myservice } from '../../providers/myservice';

import * as JsBarcode from "JsBarcode";
import * as html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
declare let BTPrinter: any;
declare var window: any;

@Component({
  selector: 'page-preview-print-page',
  templateUrl: 'preview-print-page.html',
})
export class PreviewPrintPage {
  public unregisterBackButtonAction: any;

  data;loader;toast;
  value_barcode;
  selectedPrinter:any=[];selectedPrinter2:any=[];
  printerList;printerList2;
  base64image = " ";
  base64image2;

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

  no_resi;
  pengirim;
  penerima;
  tanggal;
  servis;
  ukuran_box;
  alamat_tujuan;
  total;
  tambahan;
  berat_total;service_charge;harga;tipe_paket;
  provinsi_tujuan;kota_tujuan;
  harga_total;
  box_name;
  telp_alternatif;

  agen;
  isAgen = false;

  non_size = "-";

  PrintData:any;
  harga_show = false;

  packing_price;

  imgNota;

  constructor(
    public file: File,
    public _zone: NgZone,
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
    private bluetoothSerial: BluetoothSerial,
    private printer: Printer,
    private printProvider:PrinterService,
    private modalCtrl:ModalController,
    private base64: Base64,
    private platform: Platform,
    public serv: Myservice) {

    //DATA REAL//
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

    this.value_barcode = navParams.get("barcode");
    this.no_resi= navParams.get("barcode");
    this.pengirim= navParams.get("pengirim");
    this.penerima= navParams.get("penerima");
    this.tanggal= navParams.get("tanggal");
    this.servis= navParams.get("servis");
    this.ukuran_box= navParams.get("ukuran_box");
    this.alamat_tujuan= navParams.get("alamat_tujuan");

    this.provinsi_tujuan = navParams.get("provinsi_tujuan");
    this.kota_tujuan = navParams.get("kota_tujuan");

    this.total= navParams.get("total");
    this.tambahan= navParams.get("tambahan");

    this.pengirim_telp= navParams.get("pengirim_telp");
    this.penerima_telp= navParams.get("penerima_telp");
    this.berat_total= navParams.get("berat_total");
    this.service_charge= navParams.get("service_charge");
    this.harga= navParams.get("harga");
    this.tipe_paket= navParams.get("tipe_paket");
    this.box_name = navParams.get("box_name");
    this.non_size = navParams.get("non_size");
    if(this.non_size!="undefined" && this.non_size!="" && this.non_size!=" " && this.non_size!="-" && this.non_size){
      this.box_name = this.non_size;
    }

    this.isAgen = navParams.get("isAgen");
    this.agen = navParams.get("agen");
    this.telp_alternatif = navParams.get("telp_alternatif");

    this.packing_price = navParams.get("packing_price");

    console.log("================");
    console.log(this.navParams);
    console.log("================");

    //DATA DUMMY
    // this.value_barcode  = 18100325521300001;
    // this.no_resi        = 18100325521300001;
    // this.pengirim       = "PENGIRIM DEVTESTING";
    // this.penerima       = "PENERIMA DEVTESTING";
    // this.tanggal        = "2018-01-01";
    // this.servis         = "SERVIS DEVTESTING";
    // this.ukuran_box     = "UKURANBOX DEVTESTING";
    // this.alamat_tujuan  = "ALAMAT TUJUAN DEVTESTING";
    // this.total          = "1000000";
    // this.pengirim_telp  = "TELP PENGIRIM";
    // this.penerima_telp  = "TELP PENERIMA"
    // this.berat_total    = "10";
    // this.service_charge = "2000";
    // this.harga          = "120000"
    // this.tipe_paket     = "KILO";
    // this.provinsi_tujuan= "Jawa Barat";
    // this.kota_tujuan    = "Bogor";


    this.harga_total = this.serv.toRp(parseInt(this.harga)+parseInt(this.service_charge)+parseInt(this.tambahan)+parseInt(this.packing_price));
    this.harga = this.serv.toRp(this.harga);
    this.service_charge = this.serv.toRp(this.service_charge);
    this.tambahan = this.serv.toRp(this.tambahan);

    console.log(this.value_barcode+" "+this.no_resi+" "+this.pengirim+" "+this.penerima+" "+this.tanggal+" "+this.servis+" "+this.ukuran_box+" "+this.alamat_tujuan);
  }
  ionViewDidEnter(){
    this.base64image = " ";
  }
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
    this.base64image = " ";
    //this.createThumbnail();
  }
  ionViewWillLeave() {
      // Unregister the custom back button action for this page
      this.base64image = " ";
      this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }
  initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
          console.log('Prevent Back Button Page Change');
      }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  }
  show_harga(){
    //this.createThumbnail();
    if(this.harga_show){
      this.harga_show = false;
    }else{
      this.harga_show = true;
    }
  }
  createThumbnailX() {
    let self = this;
    const div = document.getElementById('mybarcode');
    const options = {};
    domtoimage.toPng(div, options).then((dataUrl) => {
        console.log(dataUrl);
        this.imgNota = dataUrl;
        //Initialize JSPDF
        //const doc = new jsPDF('p', 'mm', 'a4');
        //Add image Url to PDF
        //doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
        //doc.save('pdfDocument.pdf');
    });
    let element = document.getElementById("mybarcode");
    console.log(element);
    if (element !== null && element !== undefined) {
      html2canvas(element).then(function (canvas: any) {
        let dataURI = canvas.toDataURL();
        console.log('dataURI', dataURI);
        this.imgNota = dataURI;
        }.bind(this));
     }
  }
  createThumbnail() {
  let element = document.getElementById("mybarcode")
  console.log(element, 'element')
    if (element !== null && element !== undefined) {
      html2canvas(element).then(function (canvas: any) {
        let dataURI = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        console.log('img', dataURI);
        this.base64image = dataURI;
        this.base64image2 = canvas.toDataURL('image/jpeg');
        //let blobObject = this.dataURItoBlob(dataURI);
        //console.log('img', blobObject);
        //this.base64image2 = this.dataURItoBlob(dataURI);
        }.bind(this));
     }
   }
   dataURItoBlob(dataURI: string) {
    let byteString: any;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = decodeURI(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString: any = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let blob: any = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      blob[i] = byteString.charCodeAt(i);
    }
    return new Blob([blob], {
      type: mimeString
    });
  }
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
  }
  saveImage(){
    this.createThumbnail();

    var realData = this.base64image2.split(",")[1];
    console.log("img nota");
    console.log(this.base64image2);

    let blob=this.b64toBlob(realData, 'image/png');
    let nama = "resit"+Date.now()+".png";
    this.file.writeFile("file:///storage/emulated/0/", nama, blob)
    .then((a)=>{
      console.log(a);
      alert("saved to file:///storage/emulated/0/"+nama)
    })
    .catch((err)=>{
      alert(err);
      console.log('error writing blob ');
      console.log(err);
    })
  }
  list2(){
    var self = this;
    BTPrinter.list((data) => {
			console.log('Printers list:', data);
      if(self.loader){ self.loader.dismiss(); self.loader = null; }
      self.printerList2 = data;
		}, (err) => {
			console.error(`Error: ${err}`);
      if(self.loader){ self.loader.dismiss(); self.loader = null; }
		});
  }
  select_printer2(data){
    this.selectedPrinter2=data;
    this.printerList2 = [];
    console.log("selected "+data);
    var self = this;
    BTPrinter.connect(function(data){
    	console.log("Success");
    	console.log(data)
      alert("Device Connected");
    },function(err){
    	console.log("Error");
    	console.log(err)
      alert("Failed Connect Printer, Try Again");
    }, data)
  }
  print3(){
    this._zone.run(() => {
      let element = document.getElementById("mybarcode");
      if (element !== null && element !== undefined) {
      html2canvas(element).then(function (canvas: any) {
        let dataURI = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
          BTPrinter.print(function(data){
              console.log("Success");
              console.log(data);
          },function(err){
              console.log("Error");
              console.log(err)
          },dataURI);
        }.bind(this));
      }
    });
  }
  print2(){
    let self = this;
    //this.createThumbnail();
    setTimeout(()=>{
      BTPrinter.print(function(data){
          console.log("Success");
          console.log(data);
      },function(err){
          console.log("Error");
          console.log(err)
      },self.base64image);
    },0);
  }
  done(){
    this.navCtrl.setRoot(TabsPage);
  }
  duplicate_order(){
    this.navCtrl.setRoot(HomePage,{
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

      telp_alternatif:this.telp_alternatif,

      tipe_paket:this.tipe_paket
    });
  }
  toRp(angka){
      var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
      var rev2    = '';
      for(var i = 0; i < rev.length; i++){
          rev2  += rev[i];
          if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
              rev2 += '.';
          }
      }
      return 'Rp.' + rev2.split('').reverse().join('') + '';
  }
}
