import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import baseUrl from 'src/app/helpers';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validarInicioSesion(correo: string, contrasena: string): Observable<any> {
    const usuarioLogeado = { correo, contrasena };
    return this.http.post<any>(`${baseUrl}/apifm/usuarios/login`, usuarioLogeado);
  }


}
