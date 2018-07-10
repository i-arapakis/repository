import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  isLoggedIn: boolean = true;
  username: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appComponent: AppComponent) { }

  ngOnInit() {

  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
    .subscribe(
      data => {
        this.appComponent.authUser = data;
        localStorage.setItem('AuthenticatedUser', JSON.stringify(this.appComponent.authUser));
        this.router.navigate(['/home']);
        this.appComponent.loggedIn = true;
      },
      error => {
        this.isLoggedIn = false;
        this.loading = false;
      });
    }
  
}
