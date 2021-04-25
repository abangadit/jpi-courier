import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Myservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Myservice {
  //public base:String = "https://dev.jpicargo.com/";
  public base:String = "https://tracker.jpicargo.com/";
  public base_url:String   = this.base+"API/";
  public base_url_image:String   = this.base+"uploads/";
  public fcm_token : String = "";
  public header_key = "d2FrdWxpbmVybm92YXRhbWFpbmZpc2lvbg==";

  constructor(public http: Http) {
    console.log('Hello Myservice Provider');
  }

  toRp(angka){
      var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
      var rev2    = '';
      for(var i = 0; i < rev.length; i++){
          rev2  += rev[i];
          if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
              rev2 += ',';
          }
      }
      return '' + rev2.split('').reverse().join('') + '';
  }
}
