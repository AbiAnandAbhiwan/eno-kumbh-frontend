import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { OtpComponent } from './otp/otp.component';
import { CategoriesComponent } from './categories/categories.component';
import { LocationPermissionComponent } from './location-permission/location-permission.component';
import { NewMapComponent } from './mapple/new-map/new-map.component';
import { TestMapComponent } from './mapple/test-map/test-map.component';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'location-permission', component: LocationPermissionComponent },
  { path: 'maps', component: NewMapComponent },
  {path: 'direction', component: TestMapComponent},
  { path: '**', redirectTo: 'welcome' }
];
