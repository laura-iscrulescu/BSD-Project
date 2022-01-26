import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private apiURL = environment.registerURL;
  public isCollapsed = true;
  public focus: boolean;
  public focus1: boolean;
  public focus2: boolean;
  public focus3: boolean;
  public hide1 = true;
  public hide2 = true;

  public registerForm = this.formBuilder.group({
    fullName: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  constructor (private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router) { }

  ngOnInit (): void {
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.required, Validators.maxLength(50)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      repeatPassword: [null, [Validators.required, Validators.minLength(8)]]
    }, { validators: this.checkPasswords });
  }

  public async onSubmit (): Promise<void> {
    if (this.registerForm.valid) {
      const reqBody = {
        name: this.registerForm.value.fullName,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email
      };
      
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.apiURL
        };

        let res = await axios(options);

        if (res && res.status === 200) {
          if (res.data.Code === 200) {
            this.router.navigate(['account', 'login']);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  private checkPasswords (group: FormGroup) {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    return password === repeatPassword ? null : { notSame: true };
  }
}
