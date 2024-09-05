import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';
import { MenuComponent } from './menu/menu.component';
import { OrderComponent } from './order/order.component';
import { UserComponent } from './user/user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './auth/auth.guard';
import { loginGuardGuard } from './auth/login-guard.guard';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [loginGuardGuard]},
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard],
        children: [
            {path: '', component: HomeContentComponent, canActivate: [authGuard]},
            {path: 'inventory', component: InventoryComponent, canActivate: [authGuard]},
            {path: 'menu', component: MenuComponent, canActivate: [authGuard]},
            {path: 'order', component: OrderComponent, canActivate: [authGuard]},
            {path: 'users', component: UserComponent, canActivate: [authGuard]},
            {path: 'profile', component: ProfileComponent, canActivate: [authGuard]}
        ]
    },
    {path: '**', component: NotFoundComponent, canActivate: [authGuard]}
];