import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DogsService {
  route: string =  `${environment.URL_API}`;

  constructor( private http: HttpClient) {}

  getBreeds(){
    return this.http.get<any>(`${this.route}/dogs/breeds`,{withCredentials:true})
  }

  searchDogs(query?: any){
    return this.http.get<any>(`${this.route}/dogs/search`,{withCredentials:true, params: query})
  }

  matchDog(body: any){
    return this.http.post<any>(`${this.route}/dogs/match`, body, {withCredentials:true})
  }

  getDogs(body: any){
    return this.http.post<any>(`${this.route}/dogs`, body,  {withCredentials:true})
  }


  searchPagination(url: any){
    console.log(`${this.route}${url}`)
    return this.http.get<any>(`${this.route}${url}`, {withCredentials:true})
  }

}
