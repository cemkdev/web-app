import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordUpdateComponent } from './password-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { resetTokenGuard } from '../../../guards/ui/reset-token.guard';


@NgModule({
  declarations: [
    PasswordUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: PasswordUpdateComponent, canActivate: [resetTokenGuard] }
    ]),
    ReactiveFormsModule
  ]
})
export class PasswordUpdateModule { }
