import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { PilihPaket } from '../pilih-paket/pilih-paket';
import { PackageContainer } from '../package-container/package-container';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = PilihPaket;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = PackageContainer;

  isPickup = true;
  isDelivery = false;

  tipe = "pickup";

  constructor(
    private storage: Storage
  ) {
    this.storage.get('tipe').then((val) => {
      this.tipe = val;
    });
  }
}
