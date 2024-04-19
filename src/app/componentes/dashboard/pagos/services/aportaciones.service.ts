import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  getReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/apifm/aportaciones/reportes`);
  }


  getReportesMeses(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/apifm/aportaciones/montos-por-mes`);
  }

  adaptarDatosParaGrafico(): Observable<any[]> {
    return this.getReportesMeses().pipe(
      map((data: any[]) => {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
        return meses.map((mes, index) => ({
          name: mes,
          value: data[index] ? data[index][1] : 0
        }));
      })
    );
  }
  
  
  
  
}
