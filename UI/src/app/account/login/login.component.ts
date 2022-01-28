import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private apiURL = environment.loginURL;
  public hide = true;
  public isCollapsed = true;
  public focus: boolean;
  public focus2: boolean;

  public loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  constructor (private formBuilder: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit (): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  public async onSubmit (): Promise<void> {
    if (this.loginForm.valid) {
      const reqBody = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.apiURL
        };
        const res = await axios(options);
        console.log(res);
        if (res && res.status === 200) {
          if (res.data.Code === 200) {
            const response = JSON.parse(res.data.Resp);

            localStorage.setItem('userToken', response.token);
            localStorage.setItem('userId', response.user_id);
            localStorage.setItem('lang', 'EN');

            this.router.navigate(['transactions', 'home']);
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log('invalid');
    }
  }
}
