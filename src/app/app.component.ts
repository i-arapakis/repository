import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AuthenticatedUser } from './shared/AuthenticatedUser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loggedIn: boolean;
  authUser: AuthenticatedUser
  appRouter: Router

  constructor(private router: Router) { 
    if(localStorage.getItem('AuthenticatedUser')){
      let authUser = JSON.parse(localStorage.getItem('AuthenticatedUser'));
      this.authUser = new AuthenticatedUser(authUser['AuthToken'], authUser['Username'], authUser['Name'], authUser['Surname'], authUser['ValidTo']);
    }
    
    this.appRouter = router;

    if(localStorage.getItem('AuthenticatedUser')) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('AuthenticatedUser');
    this.router.navigate(['/login']);
    this.loggedIn = false;
  }
}


