import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Socio } from '../model/socio';
import { Familiar } from '../model/familia';


@Injectable({
  providedIn: 'root'
})
export class AfiliadosService {

  constructor(private http: HttpClient) { }

  getAfiliaciones(): Observable<Socio[]>{
    return this.http.get<Socio[]>(`${baseUrl}/apifm/socios`);
  }

  buscarAfiliacion(id:number): Observable<Socio>{
    return this.http.get<Socio>(`${baseUrl}/apifm/socios/${id}`);
  }

  guardarAfiliacion(dato: FormData):Observable<Socio>{
    return this.http.post<Socio>(`${baseUrl}/apifm/socios`, dato);
  }

  guardarFamiliar(dato: FormData):Observable<Familiar>{
    return this.http.post<Familiar>(`${baseUrl}/apifm/familiares`, dato);
  }

  obtenerFamiliaresPorSocioId(id: number): Observable<Familiar[]>{
    return this.http.get<Familiar[]>(`${baseUrl}/apifm/familiares/por-socio/${id}`);
  }

  // cambiarEstado(id: number, estado: boolean): Observable<any> {
  //   return this.http.post(`${baseUrl}/apifm/usuarios/cambiarEstado/${id}/${estado}`, {});
  // }

  // validarcorreo(correo: string): Observable<boolean>{
  //   return this.http.get<boolean>(`${baseUrl}/apifm/usuarios/existe-correo?correoElectronico=${correo}`);
  // }


}
