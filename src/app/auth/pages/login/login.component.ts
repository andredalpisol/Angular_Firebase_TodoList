import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  login() {
    const { email, password } = this.loginForm.value; // destructive, destruimos o objeto e atribuimos os valores a 2 variaveis
    this.authService.signInWithEmailAndPassowrd(email, password).subscribe(
      (sucess) => { this.router.navigateByUrl('/todos') },
      (error) => { this.snackbar.open('Error: ' + error.message, 'Ok', { duration: 4000, horizontalPosition: 'right', verticalPosition: 'top' }) }
    )

  }


  signUpWithGoogle() {
    this.authService.signUpWithGoogle().subscribe(
      (sucess) => { this.router.navigateByUrl('/todos') }
    )
  }

}