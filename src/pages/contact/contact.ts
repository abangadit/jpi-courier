import { Component, NgZone } from '@angular/core';
import { App,IonicPage, NavController, NavParams, LoadingController, ToastController,Platform,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/Rx';

import { Login } from '../login/login';

import { Myservice } from '../../providers/myservice';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
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
        this.get_profil(id,token);
      });
    });

  }

  get_profil(id,token){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/profile/'+id;
    let body = new FormData;
    let headers = new Headers();
    headers.append("Authorization",token);
    let options = new RequestOptions({ headers: headers });
    this.http.get(link, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.nama           = data.list[0].nama;
        this.telp           = data.list[0].telp;
        this.email          = data.list[0].email;
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
  update_profile(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'masterdata/updateprofile';
    let body = new FormData;
    body.append('login_id', this.login_id);
    body.append('nama', this.nama);
    body.append('email', this.email);
    body.append('telp', this.telp);
    body.append('password', this.password);
    let headers = new Headers();
    headers.append("Authorization",this.token);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        alert("Success");
        this.storage.get('id').then((id) => {
          this.login_id = id;
          this.storage.get('token').then((token) => {
            this.token = token;
            this.storage.set('nama', this.nama);
            this.storage.set('email', this.email);
            this.storage.set('telp', this.telp);

            this.ngZone.run(() => {
                this.get_profil(id,token);
                this.login_nama = this.nama;
            });
          });
        });
        //window.location.reload();
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
              //this.navCtrl.setRoot(Login);
            },1000);
          }
        }
      ]
    });
    confirm.present();


  }

}
