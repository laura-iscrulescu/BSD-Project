import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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

  public onSubmit (): void {
    console.log(this.registerForm);

    if (this.registerForm.valid) {
      const reqBody = {
        fullName: this.registerForm.value.fullName,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email
      };
      console.log(reqBody);

      // const res = this.http.post<any>('http://localhost:3000/api/v1/users/add', reqBody).subscribe(
      //   (data) => this.router.navigate(['login']));
    }
  }

  private checkPasswords (group: FormGroup) {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    return password === repeatPassword ? null : { notSame: true };
  }
}
