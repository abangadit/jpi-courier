import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxBarcodeModule } from 'ngx-barcode';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Base64 } from '@ionic-native/base64';
import { MyApp } from './app.component';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { ForgotPage } from '../pages/forgot/forgot';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { Splashscreen } from '../pages/splashscreen/splashscreen';
import { PreviewPrintPage } from '../pages/preview-print-page/preview-print-page';
import { DetailOrder } from '../pages/detail-order/detail-order';
import { DialogChangeStatus } from '../pages/dialog-change-status/dialog-change-status';
import { PilihPaket } from '../pages/pilih-paket/pilih-paket';
import { PackageContainer } from '../pages/package-container/package-container';
import { DialogHitungtotal } from '../pages/dialog-hitungtotal/dialog-hitungtotal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Myservice } from '../providers/myservice';
import { PrinterService } from "../providers/printerservice";


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    Splashscreen,
    PreviewPrintPage,
    DialogChangeStatus,
    DialogHitungtotal,
    PackageContainer,
    DetailOrder,
    PilihPaket,
    Login,
    ForgotPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    NgxBarcodeModule,
    HttpModule,
    FormsModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    Splashscreen,
    PreviewPrintPage,
    DialogChangeStatus,
    DialogHitungtotal,
    PackageContainer,
    DetailOrder,
    PilihPaket,
    Login,
    ForgotPage,
    TabsPage
  ],
  providers: [
    HTTP,
    Myservice,
    PrinterService,
    BluetoothSerial,
    StatusBar,
    BarcodeScanner,
    Printer,
    Base64,
    SplashScreen,
    File,
    Transfer,
    Camera,
    FilePath,
    FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
