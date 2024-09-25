import { Component, signal, inject, computed } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { Todo} from '../todo';
import { TodoService } from '../todo.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { TodoCardComponent } from '../todo-card/todo-card.component';

import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

/**
 * A component that displays a list of users, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [TodoService],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    TodoCardComponent,
    MatListModule,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  todoOwner = signal<string | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);
  todoStatus = signal<string | undefined>(undefined);

    /**
     * @param ctx
     */
  viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);

  private todoStatus$ = toObservable(this.todoStatus);
  private todoBody$ = toObservable(this.todoBody);

  serverFilteredTodos =

    toSignal(
      combineLatest([this.todoStatus$, this.todoBody$]).pipe(
        switchMap(([status, body]) =>
          this.todoService.getTodos({
            status,
            body
          })
        ),

        catchError((err) => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg.set(
              `Problem in the client – Error: ${err.error.message}`
            );
          } else {
            this.errMsg.set(
              `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
            );
          }
          this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
          return of<Todo[]>([]);
        }),
        tap(() => {
        })
      )
    );

  filteredTodos = computed(() => {
    const serverFilteredTodos = this.serverFilteredTodos();
    return this.todoService.filterTodos(serverFilteredTodos, {
      owner: this.todoOwner(),
      category: this.todoCategory(),
    });
  });
}
