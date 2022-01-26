import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;

  constructor (private router: Router) { }

  ngOnInit (): void {
  }

  public handleLogout () {
    localStorage.clear();
    this.router.navigate(["/account/login"]);
  }
}
