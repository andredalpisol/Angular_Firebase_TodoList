import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  register() {
    this.authService.signUpWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (sucess) => { this.snackbar.open('Login feito com sucesso', 'Ok', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }); this.route.navigateByUrl('/auth/verify-email') },
      (error) => { this.snackbar.open('Error: ' + error.message, 'Ok', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }) }
    )

  }

  signUpWithGoogle() {
    this.authService.signUpWithGoogle().subscribe(
      (sucess) => { this.snackbar.open('Login feito com sucesso', 'Ok', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }); this.route.navigateByUrl('/auth/verify-email') },
      (error) => { this.snackbar.open('Error: ' + error.message, 'Ok', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }) }
    )
  }
}