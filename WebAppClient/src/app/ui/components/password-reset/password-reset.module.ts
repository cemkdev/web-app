import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PasswordResetComponent } from './password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: PasswordResetComponent }
    ]),
    ReactiveFormsModule
  ]
})
export class PasswordResetModule { }
