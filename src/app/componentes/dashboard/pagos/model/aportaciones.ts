import { Socio } from "../../afiliados/model/socio";
import { Usuario } from "../../usuario/model/usuario";

export class Aportacion {
    id?: number; // va esto en la tabla
    fechaAportacion: Date; // va esto en la tabla
    monto: number;
    cuotas: number; // va esto en la tabla
    cuotasFinados: number; // va esto en la tabla
    otrasAportaciones: number; // va esto en la tabla
    descripcion: string;
    metodoPago: string;
    numeroTransaccion: string;
    estadoPago: string; // va esto en la tabla
    socio: Socio; // va esto en la tabla
    tesorero: Usuario;
  }