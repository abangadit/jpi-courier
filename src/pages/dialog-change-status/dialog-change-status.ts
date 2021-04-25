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
declare var cordova: any;

@Component({
  selector: 'page-dialog-change-status',
  templateUrl: 'dialog-change-status.html',
})
export class DialogChangeStatus {
  resi_id;resi;
  login_id;order_id;
  data;loader;toast;
  token;status;detail;

  lastImage;
  foto_file = " ";
  ktp_file = " ";
  jenis_upload = "foto";

  foto_sudah_diupload = false;
  ktp_sudah_diupload  = false;

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
    this.resi_id = navParams.get('resi_id');
    this.resi = navParams.get('resi');
    console.log("2 "+this.resi);
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);

    this.storage.get('token').then((val) => {
      this.token = val;
    });
    this.storage.get('id').then((val) => {
      this.login_id = val;
    });
  }
  close(){
    this.viewCtrl.dismiss();
  }
  cek_update_status(){
    if(this.status=="DELIVERED"){
      if(!this.foto_sudah_diupload){
        alert("Foto Cannot Be Null");
      }else{
        this.update_status();
      }
    }else{
      this.update_status();
    }
  }
  update_status(){
    let self = this;
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/updatestatus';
    let body = new FormData;
    body.append('id', this.resi_id);
    body.append('login_id', this.login_id);
    body.append('status', this.status);
    body.append('detail', this.detail);
    body.append('foto', this.foto_file);
    body.append('ktp', this.ktp_file);
    let headers = new Headers();
    headers.append("Authorization",this.token);
    //headers.append("Content-Type","application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        //alert("Status Berhasil Diubah");
        this.toast = this.toastCtrl.create({
          message: "Resi "+self.resi+" Updated",
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 3000
        });
        data.status = this.status;
        this.toast.present();
        this.viewCtrl.dismiss(data);
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
  public presentActionSheet(jenis) {
    this.jenis_upload = jenis;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
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
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
      console.log(err);
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
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log(this.lastImage);
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadImage() {
    // Destination URL
    var url = this.serv.base_url+"Upload/upload";
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // File name only
    var filename = this.lastImage;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };
    const fileTransfer: TransferObject = this.transfer.create();
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loader.dismissAll()
      console.log(data);
      console.log(this.jenis_upload);
      if(this.jenis_upload=="foto"){
        this.foto_file = data.response;
        this.foto_sudah_diupload = true;
      }else{
        this.ktp_file = data.response;
        this.ktp_sudah_diupload = true;
      }

      //this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loader.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DialogChangeStatus');
  }

}
