import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from 'src/app/models/todo';
import { AuthService } from '../../../auth/services/auth.service';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  todoForm: FormGroup = new FormGroup({
    body: new FormControl('', [Validators.required]),
    done: new FormControl(false)
  })

  todos: Todo[] = []


  constructor(
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private todoSerice: TodosService
  ) { }

  ngOnInit(): void {
    this.loadTodos()
  }

  loadTodos(): void {
    this.todoSerice.getTodos().subscribe(
      (sucess) => { this.todos = sucess; },
      (error) => { console.log(`Erro! ` + error) }
    )
  }

  create(): void {
    const todo: Todo = this.todoForm.value
    this.todoSerice.addTodo(todo).subscribe(
      (sucess) => { this.todoForm.reset(); this.snackbar.open('Tarefa salva com sucesso', 'Ok', { duration: 4000, horizontalPosition: 'right', verticalPosition: 'top' }); this.loadTodos() },
      (error) => { alert('Erro ao adicionar tarefa' + error) }
    )
  }

  delete(todo: Todo): void {
    this.todoSerice.deleteTodo(todo).subscribe(
      (next) => { this.snackbar.open('Tarefa deletada com sucesso', 'Ok', { duration: 4000, horizontalPosition: 'right', verticalPosition: 'top' }), this.loadTodos() }
    )
  }


  toggleDone(todo: Todo): void {
    todo.done = !todo.done;
    this.todoSerice.updateTodo(todo).subscribe()

  }

  signOut(): void {
    this.authService.signOut().subscribe();
  }
}