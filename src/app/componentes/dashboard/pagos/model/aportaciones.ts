import { Socio } from "../../afiliados/model/socio";
import { Usuario } from "../../usuario/model/usuario";

export class Aportacion {
    id?: number; 
    fechaAportacion: Date; 
    cuotas: number; 
    cuotasFinados: number; 
    otrasAportaciones: number; 
    descripcion: string;
    metodoPago: string;
    numeroTransaccion: string;
    estadoPago: string; 
    socio: Socio; 
    tesorero: Usuario;
  }