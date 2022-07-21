import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router';
import { from, tap } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { User } from '../../models/user';
import { GoogleAuthProvider } from 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private authenticate: AngularFireAuth, private store: AngularFirestore, private router: Router) { }

  private userCollection = this.store.collection<User>('users');

  private saveUserData() {
    return tap(async (credentials: firebase.default.auth.UserCredential) => {
      const uid = credentials.user?.uid as string;
      const email = credentials.user?.email as string;

      const todos: Todo[] = [];
      const user = await this.userCollection.ref.where('email', '==', email).get()
        .then(users => { return users.docs[0] }) //pegar primeiro documento retornado

      if (user == undefined) {
        this.userCollection.doc(uid).set({
        uid: uid,
        email: email,
        todos: todos
        }
        )
        credentials.user?.sendEmailVerification()
      }
    })
  }

  get currentUser() { //retorna o usuario que esta logado atualmente na aplicação, se ele existir, se não houver, retornara null
    return this.authenticate.authState
  }

  /* from transforma promise em observable*/
  signUpWithEmailAndPassword(email: string, password: string) {
    return from(this.authenticate.createUserWithEmailAndPassword(email, password)).pipe(
      this.saveUserData()

    )
  }


  signInWithEmailAndPassowrd(email: string, password: string) {
    return from(this.authenticate.signInWithEmailAndPassword(email, password))
  }


  signUpWithGoogle() {
    const googleProvider = new GoogleAuthProvider()
    return from(this.authenticate.signInWithPopup(googleProvider)).pipe(this.saveUserData())
  }

  signOut() {
    return from(this.authenticate.signOut()).pipe(tap(() => { this.router.navigateByUrl('/auth/login') }))
  }


}
