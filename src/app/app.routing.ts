import { Routes, RouterModule } from '@angular/router';
 
import { AppComponent } from '../app/app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/auth.guard';
import { HomeComponent } from './home/home.component';
 
const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
 
export const routing = RouterModule.forRoot(appRoutes);