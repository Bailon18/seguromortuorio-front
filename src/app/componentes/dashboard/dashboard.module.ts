import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { NavbarComponent } from './navbar/navbar.component';

import { UsuarioComponent } from './usuario/usuario.component';
import { MaterialModule } from '../../material/material.module';
import { CrearComponent } from './usuario/paginas/crear.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AfiliadosComponent } from './afiliados/afiliados.component';
import { CrearSocioComponent } from './afiliados/modals/crear-socio/crear-socio.component';
import { CrearFamiliarComponent } from './afiliados/modals/crear-familiar/crear-familiar.component';
import { PagosComponent } from './pagos/pagos.component';
import { CrearPagoComponent } from './pagos/modals/crear-pago/crear-pago.component';
import { DetallePdfComponent } from './pagos/modals/detalle-pdf/detalle-pdf.component';
import { ReporteAportacionesComponent } from './afiliados/modals/reporte-aportaciones/reporte-aportaciones.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    DashboardComponent,
    InicioComponent,
    NavbarComponent,
    UsuarioComponent,
    CrearComponent,
    AfiliadosComponent,
    CrearSocioComponent,
    CrearFamiliarComponent,
    PagosComponent,
    CrearPagoComponent,
    DetallePdfComponent,
    ReporteAportacionesComponent,
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
   
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DashboardModule { }
