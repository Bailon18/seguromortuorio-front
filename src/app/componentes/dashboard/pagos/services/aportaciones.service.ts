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

  buscarSocio(filtro: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/apifm/socios/buscar-socio?filtro=${filtro}`);
  }

  eliminarAportacion(aportacionId: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/apifm/aportaciones/${aportacionId}`);
  }
}
