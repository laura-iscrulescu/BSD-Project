import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup } from '@angular/forms';
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private apiURL = environment.changeUser;
  modals: {
    usernameRef?: BsModalRef;
    passwordRef?: BsModalRef;
    goalRef?: BsModalRef;
  } = {};

  changeUserNameForm = new FormGroup({    
    name: new FormControl(),
    email: new FormControl()
  })

  constructor(private modalService: BsModalService, public tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>, modalKey: string) {
    this.modals[modalKey] = this.modalService.show(template);
  }

  async submitUser(): Promise<void> {
    const name = this.changeUserNameForm.value.name
    const email = this.changeUserNameForm.value.email

    if(name && email) {
      const reqBody = {
        name: name,
        email: email
      }
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.apiURL,
          headers: {
            Authorization: `Bearer ${this.tokenStorageService.getToken()}`
          }
        };
        let res = await axios(options);
        if (res && res.status === 200) {
          this.changeUserNameForm.reset();
          this.modals.usernameRef?.hide();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
