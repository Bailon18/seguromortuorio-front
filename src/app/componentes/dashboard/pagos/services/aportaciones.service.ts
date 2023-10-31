import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Aportacion } from '../model/aportaciones';



@Injectable({
  providedIn: 'root'
})
export class AportacionService {

  constructor(private http: HttpClient) { }

  getAportaciones(): Observable<Aportacion[]>{
    return this.http.get<Aportacion[]>(`${baseUrl}/apifm/aportaciones`);
  }

  buscarAportacion(id:number): Observable<Aportacion>{
    return this.http.get<Aportacion>(`${baseUrl}/apifm/aportaciones/${id}`);
  }

  guardarAportacion(dato: any):Observable<Aportacion>{
    return this.http.post<Aportacion>(`${baseUrl}/apifm/aportaciones`, dato);
  }


}
