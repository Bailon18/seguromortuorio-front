import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles, Usuario } from '../model/usuario';
import baseUrl from 'src/app/helpers';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }


  getUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${baseUrl}/apifm/usuarios`);
  }

  buscarUsuario(id:number): Observable<Usuario>{
    return this.http.get<Usuario>(`${baseUrl}/apifm/usuarios/${id}`);
  }

  guardarUsuarioServi(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${baseUrl}/apifm/usuarios`, usuario, {headers: this.httpHeaders});
  }

  cambiarEstado(id: number, estado: boolean): Observable<any> {
    return this.http.post(`${baseUrl}/apifm/usuarios/cambiarEstado/${id}/${estado}`, {});
  }

  validarcorreo(correo: string): Observable<boolean>{
    return this.http.get<boolean>(`${baseUrl}/apifm/usuarios/existe-correo?correoElectronico=${correo}`);
  }


}
