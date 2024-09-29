import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TodoService } from './todo.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class AddTodoComponent {

addTodoForm = new FormGroup({
  owner: new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    (fc) => {
      if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
        return ({existingName: true});
      } else {
        return null;
      }
    },
  ])),
  category: new FormControl(''),
  body: new FormControl(''),
  status: new FormControl<boolean>(false)
});

readonly addTodoValidationMessages = {
  owner: [
    {type: 'required', message: 'Owner is required'},
    {type: 'minlength', message: 'Owner must be at least 2 characters long'},
    {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'},
    {type: 'existingName', message: 'Owner has already been taken'}
  ],
};

constructor(
  private todoService: TodoService,
  private snackBar: MatSnackBar,
  private router: Router) {
}

formControlHasError(controlOwner: string): boolean {
  return this.addTodoForm.get(controlOwner).invalid &&
    (this.addTodoForm.get(controlOwner).dirty || this.addTodoForm.get(controlOwner).touched);
}

getErrorMessage(owner: keyof typeof this.addTodoValidationMessages): string {
  for(const {type, message} of this.addTodoValidationMessages[owner]) {
    if (this.addTodoForm.get(owner).hasError(type)) {
      return message;
    }
  }
  return 'Unknown error';
}
submitForm() {
  this.todoService.addTodo(this.addTodoForm.value).subscribe({
    next: (newId) => {
      this.snackBar.open(
        `Added todo ${this.addTodoForm.value.owner}`,
        null,
        { duration: 2000 }
      );
      this.router.navigate(['/todos/', newId]);
    },
    error: err => {
      this.snackBar.open(
        `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
        'OK',
        { duration: 5000 }
      );
    },
  });
}

}
