import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController,Platform,MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http,Headers,RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

import { TabsPage } from '../tabs/tabs';
import { ForgotPage } from '../forgot/forgot';
import { PilihPaket } from '../pilih-paket/pilih-paket';
import { Myservice } from '../../providers/myservice';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  data;loader;toast;
  fcm_token;
  private formLogin: FormGroup;

  constructor(
    public http: Http,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public serv: Myservice) {
    this.formLogin = formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    })

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }
  goToForgot(){
    this.navCtrl.push(ForgotPage);
  }
  goToMain(){
    let formdata = this.formLogin.value;
    let username = formdata.username;
    let password = formdata.password;

    console.log(username+" "+password);

    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    var link = this.serv.base_url+'rest/login';
    let body = new FormData;
    body.append('username', username);
    body.append('password', password);
    body.append('fcm_token', this.fcm_token);
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, body, options)
    .timeout(10000)
    .map(res => res.json()).subscribe((data) => {
      console.log(data);
      if(this.loader){ this.loader.dismiss(); this.loader = null; }
      if(data.status=="Success"){
        this.storage.set('jasapaketindonesia_login_state', true);
        this.storage.set('id', data.id);
        this.storage.set('nama', data.nama);
        this.storage.set('email', data.email);
        this.storage.set('telp', data.telp);
        this.storage.set('role', data.role);
        this.storage.set('tipe', data.tipe);
        this.storage.set('token', data.token);
        setTimeout(()=>{
          //window.location.reload();
          this.navCtrl.setRoot(TabsPage,{});
        },1000);
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
    });
  }

}
