import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  route: string =  `${environment.URL_API}/auth`;

  constructor( private http: HttpClient) {}

  verifyLogin(body: { name: string, email: string}){
    return this.http.post<any>(`${this.route}/login`, body, {withCredentials:true})
  }

  logOut(){
    return this.http.post<any>(`${this.route}/logout`, {withCredentials:true})
  }

}
