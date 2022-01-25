import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosRequestConfig } from 'axios';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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
    console.log(this.loginForm);

    if (this.loginForm.valid) {
      console.log('valid');
      const reqBody = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      console.log(reqBody);

      // to delete after backend
      // this.router.navigate(['transactions/home']);

      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: 'http://localhost:8080/authenticator/password'
        };
        console.log(options);
        let res = await axios(options);
        if (res) {
          console.log(res);
          localStorage.setItem('userRole', res.data.role);
          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('lang', 'EN');
          // console.log(localStorage.getItem('userRole'));
          // console.log(localStorage.getItem('userToken'));

          this.router.navigate(['home']);
        }
      } catch (e) {
        console.error(e);
      }
      // const res = this.http.post<any>('http://localhost:3000/api/v1/users/login', reqBody).subscribe((data) => {
      //   localStorage.setItem('userRole', data.response.role);
      //   localStorage.setItem('userToken', data.response.token);
      //   localStorage.setItem('lang', 'EN');
      //   // console.log(localStorage.getItem('userRole'));
      //   // console.log(localStorage.getItem('userToken'));

      //   this.router.navigate(['home']);
      // });
    } else {
      console.log('invalid');
    }
  }
}
