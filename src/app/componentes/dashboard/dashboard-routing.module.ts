import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { PagosComponent } from './pagos/pagos.component';
import { RoleGuardService } from 'src/app/shared/guards/roleGuard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '', // Ruta secundaria vacía
        redirectTo: 'inicio', // Redirigir a la ruta "inicio"
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'afiliados',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'ADMINISTRADOR' },
        component: AfiliadosComponent,
      },
      {
        path: 'pagos',
        component: PagosComponent,
      },
      {
        path: 'usuarios',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'ADMINISTRADOR' },
        component: UsuarioComponent,
      },
    ],
  },
  // Agregar una redirección adicional para asegurar que 'inicio' sea la ruta por defecto
  {
    path: '**',
    redirectTo: 'inicio',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
