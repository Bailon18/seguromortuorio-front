import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { DashboardModule } from './componentes/dashboard/dashboard.module';
import { RoleGuardService } from './shared/guards/roleGuard.service';
import { AuthGuard } from './shared/guards/authGuards.service';


const routes : Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'dashboard',canActivate: [AuthGuard], loadChildren:()=> import('./componentes/dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path:'**', redirectTo:'login'}
]


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
