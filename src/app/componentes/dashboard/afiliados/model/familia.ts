import { Socio } from "./socio";

export class Familiar {
    id?: number;
    nombre: string;
    apellido: string;
    documentoIdentidad: string;
    tipoParentesco: string;
    fechaNacimiento: Date;
    edad: number;
    direccion?: string;
    telefono?: string;
    archivo: Uint8Array;
    socio: Socio;
  }
  