import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTodoService } from '../../testing/todo.service.mock';
import { Todo } from './todo';
import { TodoCardComponent } from './todo-card.component';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('User list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, TodoListComponent, TodoCardComponent],

    providers: [{ provide: TodoService, useValue: new MockTodoService() }],
});
  });

  beforeEach(waitForAsync(() => {

    TestBed.compileComponents().then(() => {

      fixture = TestBed.createComponent(TodoListComponent);

      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos().length).toBe(3);
  });

  it('contains a todo owner \'Blanche\'', () => {
    expect(todoList.serverFilteredTodos().some((user: Todo) => user.owner === 'Blanche')).toBe(true);
  });

  it('contain a todo owner \'Fry\'', () => {
    expect(todoList.serverFilteredTodos().some((user: Todo) => user.owner === 'Fry')).toBe(true);
  });

  it('doesn\'t contain a todo owner \'womp\'', () => {
    expect(todoList.serverFilteredTodos().some((user: Todo) => user.body === 'womp')).toBe(false);
  });

  it('has one active todo', () => {
    expect(todoList.serverFilteredTodos().filter((user: Todo) => user.status === true).length).toBe(1);
  });
});

