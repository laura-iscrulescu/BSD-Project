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
  public hideNew = true
  public hideOld = true

  private changeUserURL = environment.changeUser;
  private changePasswdURL = environment.changePasswd;
  private changeGoalURL = environment.changeGoal;
  modals: {
    usernameRef?: BsModalRef;
    passwordRef?: BsModalRef;
    goalRef?: BsModalRef;
  } = {};

  changeUserNameForm = new FormGroup({
    name: new FormControl()
  })

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl(),
    newPassword: new FormControl()
  })

  changeGoalForm = new FormGroup({
    goal: new FormControl()
  })

  constructor (private modalService: BsModalService, public tokenStorageService: TokenStorageService) { }

  ngOnInit (): void {
  }

  openModal (template: TemplateRef<any>, modalKey: string) {
    this.modals[modalKey] = this.modalService.show(template);
  }

  async submitUser (): Promise<void> {
    const name = this.changeUserNameForm.value.name;

    if (name) {
      const reqBody = {
        name: name
      };
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.changeUserURL,
          headers: {
            Authorization: `Bearer ${this.tokenStorageService.getToken()}`
          }
        };
        const res = await axios(options);
        if (res && res.status === 200) {
          // TODO do something with response if needed
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  async submitPassword (): Promise<void> {
    const oldPassword = this.changePasswordForm.value.oldPassword;
    const newPassword = this.changePasswordForm.value.newPassword;

    if (oldPassword && newPassword) {
      const reqBody = {
        oldPassword: oldPassword,
        newPassword: newPassword
      };
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.changePasswdURL,
          headers: {
            Authorization: `Bearer ${this.tokenStorageService.getToken()}`
          }
        };
        const res = await axios(options);
        if (res && res.status === 200) {
          this.changeUserNameForm.reset();
          this.modals.usernameRef?.hide();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  async submitGoal (): Promise<void> {
    const goal = this.changeGoalForm.value.goal;

    if (goal) {
      const reqBody = {
        goal: goal
      };
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.changeGoalURL,
          headers: {
            Authorization: `Bearer ${this.tokenStorageService.getToken()}`
          }
        };
        const res = await axios(options);
        if (res && res.status === 200) {
          this.changeGoalForm.reset();
          this.modals.goalRef?.hide();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
