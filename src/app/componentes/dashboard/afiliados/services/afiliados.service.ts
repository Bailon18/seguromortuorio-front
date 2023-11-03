import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Socio } from '../model/socio';
import { Familiar } from '../model/familia';
import { Aportacion } from '../../pagos/model/aportaciones';


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

  existsByCorreoElectronico(correoElectronico: string): Observable<boolean> {
    const url = `${baseUrl}/apifm/socios/exists-correo?correoElectronico=${correoElectronico}`;;
    return this.http.get<boolean>(url);
  }

  existsByDocumentoIdentidad(documentoIdentidad: string): Observable<boolean> {
    const url = `${baseUrl}/apifm/socios/exists-documento?documentoIdentidad=${documentoIdentidad}`;
    return this.http.get<boolean>(url);
  }

  existsByDocumentoIdentidadFamiliar(documentoIdentidad: string): Observable<boolean> {
    const url = `${baseUrl}/apifm/familiares/exists-documento?documentoIdentidad=${documentoIdentidad}`;
    return this.http.get<boolean>(url);
  }

  eliminarFamiliar(familiarId: number): Observable<void> {
    const url = `${baseUrl}/apifm/familiares/${familiarId}`;
    return this.http.delete<void>(url);
  }

  buscarFamiliarId(id:number): Observable<Familiar>{
    return this.http.get<Familiar>(`${baseUrl}/apifm/familiares/${id}`);
  }

  getAportacionAhoSocio(socioId: number): Observable<number[]> {
    return this.http.get<number[]>(`${baseUrl}/apifm/aportaciones/aportacion-aho?socioId=${socioId}`);
  }

    getAportacionesPorAnioYIdSocio(year: number, socioId: number): Observable<Aportacion[]> {
    return this.http.get<Aportacion[]>(`${baseUrl}/apifm/aportaciones/por-ano-y-socio?year=${year}&socioId=${socioId}`);
  }
}
