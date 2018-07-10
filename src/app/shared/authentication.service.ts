import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthenticatedUser } from '../shared/AuthenticatedUser';
 
@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }
 
    login(username: string, password: string) {
        return this.http.post<AuthenticatedUser>('http://localhost/HPSmartContactAdministration/api/Login/Authenticate', { username: username, password: password });
    }
 
  
}