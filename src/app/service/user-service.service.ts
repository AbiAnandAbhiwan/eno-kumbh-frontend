import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseUrl = 'https://enoapi.abhiwandemos.com/users';

  constructor(private http: HttpClient) { }

  sendOtp(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp?phoneNumber=${phoneNumber}`, null, { observe: 'response' });
  }

  verifyOtp(phoneNumber: string, otp: string): Observable<any> {
    const requestBody = { phoneNumber, otp };
    return this.http.post(`${this.baseUrl}/verify-otp`, requestBody, { observe: 'response' });
  }

  getAccessTokenForMappls(): Observable<string> {
    const url = `${this.baseUrl}/access-token`;

    return new Observable(observer => {
      this.http.get<string>(url, { responseType: 'text' as 'json' }).subscribe({
        next: (accessToken) => {
          // Save the token to localStorage
          console.log("below is token");
          console.log(accessToken);
          localStorage.setItem('mapplsAccessToken', accessToken);

          observer.next(accessToken);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
