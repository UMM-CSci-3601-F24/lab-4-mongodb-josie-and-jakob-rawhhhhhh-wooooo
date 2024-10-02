import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: `root`
})
export class TodoService {
  readonly todoUrl: string = `${environment.apiUrl}todos`;

  private readonly ownerKey = 'owner';
  private readonly categoryKey = 'category';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { owner?: string; category?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.owner) {
        httpParams = httpParams.set(this.ownerKey, filters.owner);
      }
      if (filters.category) {
        httpParams = httpParams.set(this.categoryKey, filters.category);
      }
    }

    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }


  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.todoUrl}/${id}`);
  }


  filterTodos(todos: Todo[], filters: { status?: string; body?: string; limit?: number}): Todo[] { // skipcq: JS-0105
    let filteredTodos = todos;

    // Filter by status
    if (filters.status !== undefined) {

      filteredTodos = filteredTodos.filter(todo => todo.status.toString() === filters.status);
    }

    // Filter by category
    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }

    if (filters.limit !== undefined && Number.isInteger(filters.limit)) {
      filteredTodos = filteredTodos.slice(0, filters.limit);
    }

    return filteredTodos;
  }

  sortTodos(todos: Todo[], criterion: 'owner' | 'category' | 'status'): Todo[] {
    return todos.sort((a, b) => {
      if (a[criterion] < b[criterion]) {
        return -1;
      } else if (a[criterion] > b[criterion]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  addTodo(newTodo: Partial<Todo>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
  }
}
