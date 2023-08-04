import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController,Platform,MenuController,ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { Login } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { PreviewPrintPage } from '../preview-print-page/preview-print-page';
import { DialogHitungtotal } from '../dialog-hitungtotal/dialog-hitungtotal';

import { Myservice } from '../../providers/myservice';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileUploader, FileItem } from 'ng2-file-upload';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  login_id;login_nama;
  data;loader;toast;
  token;
  num = 0;
  jumlah_item = [];
  obj = [];
  data_item;data_box;
  data_provinsi;data_kota;data_kecamatan;data_negara;
  data_provinsi2;data_kota2;data_kecamatan2;

  tipe_paket;box_id;box_name;isi_box;

  //field form//
  private formOrder: FormGroup;
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
  jenis_pengiriman = "reguler";
  non_size = "";

  isMalaysia = false;
  isMalaysia2 = false;

  public nama_barang:any=[];
  public satuan:any=[];
  public qty:any=[];
  public berat:any=[];
  public keterangan:any=[];
  public anArray:any=[];

  //BarcodeScanner
  options : BarcodeScannerOptions;
  encodedData : {} ;

  panjang;lebar;tinggi;

  items = [];

  lastImage;bukti1;foto;isUploaded;bukti2;

  packing;

  kilogram;
  uploader;
  uploader2;
  loading;

  constructor(
    public http: Http,
    public appCtrl: App,
    public modalCtrl: ModalController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcode: BarcodeScanner,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private transfer: FileTransfer,
    public platform: Platform,
    public serv: Myservice) {
    this.setupUploader();
    this.setupUploader2();

    this.tipe_paket = this.navParams.get("tipe_paket");
    this.box_id = this.navParams.get("box_id");
    this.box_name = this.navParams.get("box_name");

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
    this.telp_alternatif = this.navParams.get("telp_alternatif");



    console.log(this.navParams);

    this.storage.get('token').then((val) => {
      this.token = val;
      this.get_negara();
      this.get_packing();
      this.get_box();

      if(this.penerima_kota){
        this.get_kota2(this.penerima_provinsi);
        setTimeout(()=>{
          this.penerima_kota = this.navParams.get("penerima_kota");
        },1000);
      }

    });
    this.storage.get('id').then((val) => {
      this.login_id = val;
    });
    this.storage.get('nama').then((val) => {
      this.login_nama = val;
    });

    this.tambah_item();

    this.formOrder = formBuilder.group({
      'pengirim_tanggal': ['', Validators.required],
      'pengirim_nama': ['', Validators.required],
      'pengirim_provinsi': ['', Validators.required],
      'pengirim_kota': ['', Validators.required],
      'pengirim_kecamatan': ['', Validators.required],
      'pengirim_kodepos': ['', Validators.required],
      'pengirim_alamat': ['', Validators.required],
      'pengirim_telp': ['', Validators.required],
      'penerima_tanggal': ['', Validators.required],
      'penerima_nama': ['', Validators.required],
      'penerima_provinsi': ['', Validators.required],
      'penerima_kota': ['', Validators.required],
      'penerima_kecamatan': ['', Validators.required],
      'penerima_kodepos': ['', Validators.required],
      'penerima_alamat': ['', Validators.required],
      'penerima_telp': ['', Validators.required],
      'ukuran_box': ['', Validators.required],
      'nama_barang': ['', Validators.required],
      'qty': ['', Validators.required],
      'satuan': ['', Validators.required],
      'berat': ['', Validators.required],
      'keterangan': ['', Validators.required],
    })
  }
  presentToast(tes){

  }
  setupUploader() {
      this.uploader = new FileUploader({  
        url: this.serv.base_url + "upload/upload",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader.onBeforeUploadItem = (item: FileItem) => {
          console.log("----onBeforeUploadItem");
          this.loader = this.loadingCtrl.create({
            content: "Please wait..."
          });
          this.loader.present();
        
          //add additional parameters for the serverside
          this.uploader.options.additionalParameter = {
              name: item.file.name,
              section: "whatever",
              //userid = __this.auth.user.userid;
          };
      };
      
      this.uploader.onAfterAddingFile = (fileItem) => {
          console.log("JUST ADDED A FILE: " + fileItem._file.name);
          fileItem.withCredentials = false;
      }

      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        console.log("A ITEM UPLOADED SUCCESSFULLY");
        console.log(response);
        if(response.includes("error")){
          alert(response);
          this.isUploaded = false;
        }else{
          alert("file uploaded");
          this.bukti1 = response;
          this.isUploaded = true;
        }
        if(this.loader){ this.loader.dismiss(); this.loader = null; }
        console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  setupUploader2() {
      this.uploader2 = new FileUploader({  
        url: this.serv.base_url + "upload/upload",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader2.onBeforeUploadItem = (item: FileItem) => {
          console.log("----onBeforeUploadItem");
          this.loader = this.loadingCtrl.create({
            content: "Please wait..."
          });
          this.loader.present();
        
          //add additional parameters for the serverside
          this.uploader2.options.additionalParameter = {
              name: item.file.name,
              section: "whatever",
              //userid = __this.auth.user.userid;
          };
      };
      
      this.uploader2.onAfterAddingFile = (fileItem) => {
          console.log("JUST ADDED A FILE: " + fileItem._file.name);
          fileItem.withCredentials = false;
      }

      this.uploader2.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        console.log("A ITEM UPLOADED SUCCESSFULLY");
        console.log(response);
        if(response.includes("error")){
          alert(response);
          this.isUploaded = false;
        }else{
          alert("file uploaded");
          this.bukti2 = response;
          this.isUploaded = true;
        }
        if(this.loader){ this.loader.dismiss(); this.loader = null; }
        console.log("--uploader.getNotUploadedItems().length: " + this.uploader2.getNotUploadedItems().length);
    };
  }
  camera1(){
    this.takePicture(this.camera.PictureSourceType.CAMERA,"1");
  }
  camera2(){
    this.takePicture(this.camera.PictureSourceType.CAMERA,"2");
  }
  public takePicture(sourceType,enumx) {
    // Create options for the Camera Dialog
    var options = {
      quality: 30,
      targetWidth: 800,
      targetHeight: 800,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, enumx) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      if(enumx==1){
        this.uploadImage(enumx);
      }else if(enumx==2){
        this.uploadImage(enumx);
      }
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadImage(enumx) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var url = this.serv.base_url+"upload/upload"; 
    console.log(url);
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // File name only
    var filename = this.lastImage;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        'fileName': filename,
      }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    // Use the FileTransfer to upload the image
    //"{"status":true,"id_attendance":24,"nama_file":"201905191649221558259359099.jpg","message":"Upload and move success and Your data has been successfully stored into the database"}"
    fileTransfer.upload(targetPath, url, options).then(data => {
      //let json = JSON.parse(data.response);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      let json = data.response;
      this.lastImage = json;
      this.presentToast('Image succesful uploaded.');
      console.log(json);
      if(enumx=="1"){
        this.bukti1 = json;
      }else{
        this.bukti2 = json;
      }
      console.log(enumx+"."+this.bukti1+" - "+this.bukti2);
      this.foto   = json;
      this.isUploaded = true;
    }, err => {
      this.presentToast('Error while uploading file.');
      console.log(err);
    });
  }
  get_packing(){
    var link = this.serv.base_url+'masterdata/t_packing';
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
        this.data_item = data.data;
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
  get_negara(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/t_negara';
    let body = new FormData;
    let headers = new Headers();
    headers.append("Authorization",this.token);
    headers.append("Content-Type","application/x-www-form-urlencoded");
    console.log(headers);
    let options = new RequestOptions({ headers: headers });
    this.http.get(link, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.data_negara = data.data;

        this.pengirim_negara = "2";
        this.penerima_negara = "1";
        setTimeout(()=>{    //<<<---    using ()=> syntax
          if(this.loader){ this.loader.dismiss(); this.loader = null; }
            this.get_provinsi("2");
            this.get_provinsi2("1");
          },800);
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
  get_provinsi(val){
    if(val==2){
      this.isMalaysia = true;
    }else{
      this.isMalaysia = false;
    }

    // this.loader = this.loadingCtrl.create({
    //   content: "Please wait..."
    // });
    // this.loader.present();
    var link = this.serv.base_url+'masterdata/getprovinsi/t_provinsi/negara_id/'+val;
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
        this.data_provinsi = data.data;

        if(val==2){
          for(let x = 0;x<this.data_provinsi.length;x++){
            this.get_kota(this.data_provinsi[x].provinsi_id);
          }
        }
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
  get_provinsi2(val){
    if(val==2){
      this.isMalaysia2 = true;
    }else{
      this.isMalaysia2 = false;
    }

    // this.loader = this.loadingCtrl.create({
    //   content: "Please wait..."
    // });
    // this.loader.present();
    var link = this.serv.base_url+'masterdata/t_provinsi/negara_id/'+val;
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
        this.data_provinsi2 = data.data;
        if(val==2){
          for(let x = 0;x<this.data_provinsi2.length;x++){
            this.get_kota2(this.data_provinsi2[x].provinsi_id);
          }
        }

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
  get_kota(id){
    // this.loader = this.loadingCtrl.create({
    //   content: "Please wait..."
    // });
    // this.loader.present();
    var link = this.serv.base_url+'masterdata/t_kota/provinsi_id/'+id;
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
        this.data_kota = data.data;
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
  get_kecamatan(id){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/t_kecamatan/kota_id/'+id;
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
        this.data_kecamatan = data.data;
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
  get_kota2(id){
    var link = this.serv.base_url+'masterdata/t_kota/provinsi_id/'+id;
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
        this.data_kota2 = data.data;
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
  get_kecamatan2(id){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/t_kecamatan/kota_id/'+id;
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
        this.data_kecamatan2 = data.data;
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
  create_orderx(){
    console.log(this.isi_box);
    let spl = this.isi_box.split(";");
    console.log(spl);

    // let new_ar_item = [];
    // console.log(this.items);
    // for(let i=0;i<this.items.length;i++){
    //   if(this.items[i]){
    //     console.log(this.data_item[i]);
    //     var eachItem = {
    //         "nama_barang": this.nama_barang[i],
    //         //"berat": this.berat[x],
    //         //"qty":this.qty[x],
    //         "qty":1,
    //         "keterangan":"-"
    //     };
    //     new_ar_item.push(eachItem);
    //   }
    // }
    // console.log(new_ar_item);
  }
  create_order(){
    this.obj = [];
    console.log(this.isi_box);
    let spl = this.isi_box.split(";");
    console.log(spl);
    
    if (!this.kilogram){
      alert("Kilogram Required")
    }else if(!this.bukti1){
      alert("Photo 1 Required")
    }else if(!this.bukti2){
      alert("Photo 2 Required")
    }else{
      for(let i=0;i<spl.length;i++){
        if(spl[i]){
          var eachItem = {
              "nama_barang": spl[i],
              //"berat": this.berat[x],
              //"qty":this.qty[x],
              "qty":1,
              "keterangan":"-"
          };
          this.obj.push(eachItem);
        }
      }
      console.log(this.obj);
      this.hitung_total();
    }
    // for(let x = 0;x<this.jumlah_item.length;x++){
    //   var eachItem = { 
    //        "nama_barang": this.nama_barang[x],
    //        //"berat": this.berat[x],
    //        //"qty":this.qty[x],
    //        "qty":1,
    //        "keterangan":this.keterangan[x]
    //    };
    //    this.obj.push(eachItem);
    // }
  }
  get_id(obj,id){
    for(let x = 0;x<obj.length;x++){
      if(obj[x].provinsi_id==id){
        return x;
      }
    }
  }
  get_id2(obj,id){
    for(let x = 0;x<obj.length;x++){
      if(obj[x].kota_id==id){
        return x;
      }
    }
  }
  hitung_total(){
    this.provinsi_tujuan = this.data_provinsi2[this.get_id(this.data_provinsi2,this.penerima_provinsi)].name;
    this.kota_tujuan = this.data_kota2[this.get_id2(this.data_kota2,this.penerima_kota)].name;

    console.log("================");
    console.log(this.data_provinsi2);
    console.log(this.penerima_provinsi);
    console.log(this.data_kota2);
    console.log(this.penerima_kota);
    console.log(this.provinsi_tujuan);
    console.log(this.get_id(this.data_provinsi2,this.penerima_provinsi));
    console.log(this.get_id2(this.data_kota2,this.penerima_kota));
    console.log(this.kota_tujuan);
    console.log("================");

    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/hitunghargatotal';
    let body = new FormData;
    body.append("login_id",this.login_id);
    body.append("pengirim_tanggal",this.pengirim_tanggal);
    body.append('pengirim_nama', this.pengirim_nama);
    body.append('pengirim_negara', this.pengirim_negara);
    body.append('pengirim_provinsi', this.pengirim_provinsi);
    body.append('pengirim_kota', this.pengirim_kota);
    body.append('pengirim_kodepos', " ");
    body.append('pengirim_passport', this.pengirim_passport);
    body.append('pengirim_alamat', this.pengirim_alamat);
    body.append('pengirim_telp', this.pengirim_telp);
    body.append('penerima_tanggal', this.penerima_tanggal);
    body.append('penerima_nama', this.penerima_nama);
    body.append('penerima_negara', this.penerima_negara);
    body.append('penerima_provinsi', this.penerima_provinsi);
    body.append('penerima_kota', this.penerima_kota);
    body.append('penerima_kodepos', this.penerima_kodepos);
    body.append('penerima_alamat', this.penerima_alamat);
    body.append('penerima_telp', this.penerima_telp);
    body.append('ukuran_box', this.box_id);
    body.append('jenis_pengiriman', this.jenis_pengiriman);
    body.append('berat_total',this.berat_total);
    body.append('tipe_paket',this.tipe_paket);
    body.append('kilogram',this.kilogram);

    body.append('panjang',this.panjang);
    body.append('lebar',this.lebar);
    body.append('tinggi',this.tinggi);

    body.append('image_1',this.bukti1);
    body.append('image_2',this.bukti2);

    if(this.tipe_paket=="box"){
      body.append('box_id',this.box_id);
      body.append('non_size',this.non_size);
    }
    body.append('item', JSON.stringify(this.obj));
    let headers = new Headers();
    headers.append("Authorization",this.token);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.harga = data.message;
        let komisi = data.komisi;
        // if(data.message=="" || data.message==" " || data.message==null){
        //   alert("Harga Tidak Terdaftar");
        // }else{
          let profileModal = this.modalCtrl.create(DialogHitungtotal, {
            total: data.message,
            obj: this.obj,
            tipe_paket: this.tipe_paket,
            box_id: this.box_id,
            box_name: this.box_name,
            jenis_pengiriman: this.jenis_pengiriman,
            berat_total: this.berat_total,
            provinsi_tujuan : this.provinsi_tujuan,
            kota_tujuan : this.kota_tujuan,
            telp_alternatif: this.telp_alternatif,
            komisi:komisi,
            non_size:this.non_size,

            pengirim_tanggal: this.pengirim_tanggal,
            pengirim_nama: this.pengirim_nama,
            pengirim_telp: this.pengirim_telp,
            pengirim_alamat: this.pengirim_alamat,
            pengirim_kodepos: this.pengirim_kodepos,
            pengirim_negara: this.pengirim_negara,
            pengirim_provinsi: this.pengirim_provinsi,
            pengirim_kota: this.pengirim_kota,
            pengirim_passport: this.pengirim_passport,

            penerima_tanggal: this.penerima_tanggal,
            penerima_nama: this.penerima_nama,
            penerima_telp: this.penerima_telp,
            penerima_alamat: this.penerima_alamat,
            penerima_kodepos: this.penerima_kodepos,
            penerima_negara: this.penerima_negara,
            penerima_provinsi: this.penerima_provinsi,
            penerima_kota: this.penerima_kota,
            kilogram: this.kilogram,

            panjang: this.panjang,
            lebar: this.lebar,
            tinggi: this.tinggi,

            image_1: this.bukti1,
            image_2: this.bukti2,

            packing: this.packing,
           });
            profileModal.onDidDismiss(data => {
              console.log(data);
            });
          profileModal.present();
        //}


        // let alert = this.alertCtrl.create({
        //   title: 'Total Harga Dasar : '+this.serv.toRp(data.message),
        //   inputs: [
        //     {
        //       name: 'Service Charge',
        //       placeholder: 'Masukan Service Charge'
        //     }
        //   ],
        //   buttons: [
        //     {
        //       text: 'Cancel',
        //       role: 'cancel',
        //       handler: data => {
        //         console.log('Cancel clicked');
        //       }
        //     },
        //     {
        //       text: 'Submit',
        //       handler: data => {
        //         console.log(data['Service Charge']);
        //         if(data['Service Charge']!=" "){
        //           this.process_create_order(data['Service Charge']);
        //         }else{
        //           this.process_create_order("0");
        //         }
        //       }
        //     }
        //   ]
        // });
        // alert.present();
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
  get_box(){
    var link = this.serv.base_url+'masterdata/t_box';
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
        this.data_box = data.data;
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
  process_create_order(harga_final){

    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/createorder';
    let body = new FormData;
    body.append("login_id",this.login_id);
    body.append("pengirim_tanggal",this.pengirim_tanggal);
    body.append('pengirim_nama', this.pengirim_nama);
    body.append('pengirim_provinsi', this.pengirim_provinsi);
    body.append('pengirim_kota', this.pengirim_kota);
    body.append('pengirim_kodepos', this.pengirim_kodepos);
    body.append('pengirim_alamat', this.pengirim_alamat);
    body.append('pengirim_telp', this.pengirim_telp);
    body.append('penerima_tanggal', this.penerima_tanggal);
    body.append('penerima_nama', this.penerima_nama);
    body.append('penerima_provinsi', this.penerima_provinsi);
    body.append('penerima_kota', this.penerima_kota);
    body.append('penerima_kodepos', " ");
    body.append('penerima_alamat', this.penerima_alamat);
    body.append('penerima_telp', this.penerima_telp);
    body.append('ukuran_box', this.box_id);
    body.append('jenis_pengiriman', this.jenis_pengiriman);
    body.append('berat_total',this.berat_total);
    body.append('tipe_paket',this.tipe_paket);
    body.append('service_charge',harga_final);
    if(this.tipe_paket=="box"){
      body.append('box_id',this.box_id);
    }
    body.append('item', JSON.stringify(this.obj));
    let headers = new Headers();
    headers.append("Authorization",this.token);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        alert("Order Berhasil Dibuat");
        //this.clear_form();
        this.navCtrl.push(PreviewPrintPage,{barcode:data.barcode,pengirim:this.pengirim_nama,tanggal:data.pengirim_tanggal,penerima:this.penerima_nama,pengirim_passport:this.pengirim_passport,ukuran_box:this.ukuran_box,servis:this.jenis_pengiriman,alamat_tujuan:this.penerima_alamat,total:data.total_harga,pengirim_telp:this.pengirim_telp,penerima_telp:this.penerima_telp,berat_total:this.berat_total,service_charge:harga_final,harga:this.harga,tipe_paket:this.tipe_paket,box_name:data.box_name,provinsi_tujuan:this.provinsi_tujuan,kota_tujuan:this.kota_tujuan});
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
  tambah_item(){
    this.num += 1;
    this.jumlah_item.push({'idx':this.num});
    this.anArray.push({'value':this.num});
    this.toast = this.toastCtrl.create({
      message: "Item Ditambahkan",
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000
    });
    //this.toast.present();
  }
  clear_form(){
    this.pengirim_tanggal = "";
    this.pengirim_nama = "";
    this.pengirim_telp = "";
    this.pengirim_alamat = "";
    this.pengirim_kodepos = "";
    this.pengirim_provinsi = "";
    this.pengirim_kota = "";

    this.penerima_tanggal = "";
    this.penerima_nama = "";
    this.penerima_telp = "";
    this.penerima_alamat = "";
    this.penerima_kodepos = "";
    this.penerima_provinsi = "";
    this.penerima_kota = "";

    this.ukuran_box = "";
    this.jenis_pengiriman = "";

    this.jumlah_item = [];
    this.tambah_item();
  }
  async encodeData(){
    this.barcode.encode(this.barcode.Encode.TEXT_TYPE,this.encodeData).then((encodedData) => {
        console.log(encodedData);
        this.encodedData = encodedData;
    }, (err) => {
        console.log("Error occured : " + err);
    });
  }

}
