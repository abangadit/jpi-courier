import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class PrinterService {
  private win: any;
  private defaultTimeout: Number = 100;

  constructor(private platform: Platform) {
    this.win = window;
    this.platform.ready().then(() => {
      if (this.win.cordova && !this.win.DatecsPrinter) {
        console.warn("DatecsPrinter plugin is missing. Have you installed the plugin? \nRun 'cordova plugin add cordova-plugin-datecs-printer'");
      }
    });
  }

  listBluetoothDevices() {
    return new Promise<any>((resolve, reject) => {
      this.win.DatecsPrinter.listBluetoothDevices((success) => resolve(success), (error) => reject(error));
    });
  }

  connect(deviceAddress: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => this.win.DatecsPrinter.connect(deviceAddress, (success) => resolve(success), (error) => reject(error)), this.defaultTimeout);
    });
  }

  disconnect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.win.DatecsPrinter.disconnect((success) => resolve(success), (error) => reject(error))
    });
  }

  feedPaper(lines: Number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.win.DatecsPrinter.feedPaper(lines, (success) => resolve(success), (error) => reject(error));
    });
  }


  public printText(text, charset = 'UTF-8'){
      // ISO-8859-1
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.printText( text, charset, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public printSelfTest(){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.printSelfTest( function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public getStatus(){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.getStatus( function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public getTemperature(){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.getTemperature( function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public setBarcode(align, small, scale, hri, height){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.setBarcode( align, small, scale, hri, height, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public printBarcode(data, type = 73 ){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.printBarcode( type, data, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public printImage(image, width, height, align){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.printImage( image, width, height, align, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public drawPageRectangle(x, y, width, height, fillMode){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.drawPageRectangle( x, y, width, height, fillMode, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public drawPageFrame(x, y, width, height, fillMode, thickness){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.drawPageFrame( x, y, width, height, fillMode, thickness, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public selectPageMode(){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.selectPageMode( function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public selectStandardMode(){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.selectStandardMode( function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public setPageRegion(x, y, width, height, direction){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.setPageRegion( x, y, width, height, direction, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public printPage(){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.printPage( function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public write(bytes){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.write( bytes, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }

  public writeHex(hex){
      return new Promise((resolve, reject) => {
          this.win.DatecsPrinter.writeHex( hex, function (success) {
              resolve(success);
          }, function (error) {
              reject(error);
          });
      });
  }
}
