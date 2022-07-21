import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, mergeMap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../models/user';
import { Todo } from '../../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private userCollection = this.store.collection<User>('users');
  private curretUser = this.authService.currentUser;


  constructor(
    private store: AngularFirestore, private authService: AuthService
  ) { }

  getTodos() {
    return this.curretUser.pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get() //aqui ja vamos acessar todos dados do usuario
      }),
      map(userDoc => {
        return userDoc.data()?.todos || [];
      }
      ))
  }


  addTodo(todo: Todo) {

    return this.curretUser.pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        const user = userDoc.data() as User

        todo.id = this.store.createId()

        user.todos.push(todo)

        return userDoc.ref.update(user)
      }))
  }

  deleteTodo(todo: Todo) {
    return this.curretUser.pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        const user = userDoc.data() as User

        user.todos = user.todos.filter((x) => x.id != todo.id)

        return userDoc.ref.update(user)
      }))
  }

  updateTodo(todo: Todo) {
    return this.curretUser.pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        const user = userDoc.data() as User

        user.todos = user.todos.map(t => { //for of - percorrera todo array - se o id do todo mandado for igual, ira alterar, se não mantera igual
          if (t.id == todo.id) {
            return todo;
          }
          return t;
        })

        return userDoc.ref.update(user)
      }))
  }


}
