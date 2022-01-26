import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  modals: {
    usernameRef?: BsModalRef;
    passwordRef?: BsModalRef;
    goalRef?: BsModalRef;
  } = {};

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>, modalKey: string) {
    this.modals[modalKey] = this.modalService.show(template);
  }
}
