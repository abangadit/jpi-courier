import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Port } from '../../types/index';
import { PortService } from '../../services/index';

@Component({
  selector: 'page-modal',
  templateUrl: './pages/modal/modal.html'
})
export class ModalPage {
  port: Port;
  ports: Port[];

  constructor(private viewController: ViewController, private portService: PortService) {
    this.ports = this.portService.getPorts();
  }

  dismiss() {
    this.viewController.dismiss();
  }
}
