// import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
// import { TestBed, waitForAsync } from '@angular/core/testing';
// import { of } from 'rxjs';
// import { Todo } from './todo';
// import { TodoService } from './todo.service';

// describe('TodoService', () => {
//   // A small collection of test todos
//   const testTodoss: Todo[] = [
//     {
//       _id: 'chris_id',
//       owner: 'Chris',
//       category: 'video games',
//       body: 'do yo stuff fool',
//       status: false

//     },
//     {
//       _id: 'jakob_id',
//       owner: 'Jakob',
//       category: 'being cool',
//       body: 'im nothing like yall',
//       status: false

//     },
//     {
//       _id: 'john_id',
//       owner: 'John',
//       category: 'swimming',
//       body: 'flex on the haters',
//       status: true

//     },
//     {
//       _id: 'jakob_id2',
//       owner: 'Jakob',
//       category: 'swimming',
//       body: 'run up on them fools',
//       status: true

//     }
//   ];
//   let todoService: TodoService;
//   let httpClient: HttpClient;
//   let httpTestingController: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//     imports: [],
//     providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
// });
//     httpClient = TestBed.inject(HttpClient);
//     httpTestingController = TestBed.inject(HttpTestingController);
//     todoService = new TodoService(httpClient);
//   });

//   afterEach(() => {
//     httpTestingController.verify();
//   });

//   describe('When getTodos() is called with no parameters', () => {
//     it('calls `api/todos`', waitForAsync(() => {
//       const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));
//       todoService.getTodos().subscribe((todos) => {
//         expect(todos)
//           .withContext('returns the test todos')
//           .toBe(testTodos);
//         expect(mockedMethod)
//           .withContext('one call')
//           .toHaveBeenCalledTimes(1);
//         expect(mockedMethod)
//           .withContext('talks to the correct endpoint')
//           .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams() });
//       });
//     }));
//   });

