import { Component, NgZone } from '@angular/core';
import { App,IonicPage, NavController, NavParams, LoadingController, ToastController,Platform,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/Rx';

import { Login } from '../login/login';

import { Myservice } from '../../providers/myservice';

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html'
})
export class ForgotPage {
  login_id;order_id;
  data;loader;toast;
  token;
  login_nama;

  nama;telp;email;password;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public http: Http,
    public serv:Myservice,
    private platform: Platform,
    public alertCtrl: AlertController,
    public ngZone : NgZone) {
    this.storage.get('nama').then((val) => {
      this.login_nama = val;
    });
    this.storage.get('id').then((id) => {
      this.login_id = id;
      this.storage.get('token').then((token) => {
        this.token = token;
      });
    });

  }

  reset_password(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'rest/resetpassword';
    let body = new FormData;
    body.append('email', this.email);
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        alert("Email Sent, Please Check Your Email For Next Step (Check SPAM Folder)")
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

  logout(){
    let confirm = this.alertCtrl.create({
      title: 'Logout ?',
      message: 'Yakin Logout Aplikasi?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.storage.clear();
            this.loader = this.loadingCtrl.create({
              content: "Please wait..."
            });
            this.loader.present();
            setTimeout(()=>{    //<<<---    using ()=> syntax
            if(this.loader){ this.loader.dismiss(); this.loader = null; }
              //window.location.reload();
              this.appCtrl.getRootNav().setRoot(Login);
            },1000);
          }
        }
      ]
    });
    confirm.present();


  }

}
