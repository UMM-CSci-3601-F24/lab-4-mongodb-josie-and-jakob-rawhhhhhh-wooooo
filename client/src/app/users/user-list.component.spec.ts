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
import { MockUserService } from '../../testing/user.service.mock';
import { User } from './user';
import { UserCardComponent } from './user-card.component';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
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

  let userList: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, UserListComponent, UserCardComponent],
    // providers:    [ UserService ]  // NO! Don't provide the real service!
    // Provide a test-double instead
    providers: [{ provide: UserService, useValue: new MockUserService() }],
});
  });

  // This constructs the `userList` (declared
  // above) that will be used throughout the tests.
  beforeEach(waitForAsync(() => {
  // Compile all the components in the test bed
  // so that everything's ready to go.
    TestBed.compileComponents().then(() => {
      /* Create a fixture of the UserListComponent. That
       * allows us to get an instance of the component
       * (userList, below) that we can control in
       * the tests.
       */
      fixture = TestBed.createComponent(UserListComponent);
      userList = fixture.componentInstance;
      /* Tells Angular to sync the data bindings between
       * the model and the DOM. This ensures, e.g., that the
       * `userList` component actually requests the list
       * of users from the `MockUserService` so that it's
       * up to date before we start running tests on it.
       */
      fixture.detectChanges();
    });
  }));

  it('contains all the users', () => {
    expect(userList.serverFilteredUsers().length).toBe(3);
  });

  it('contains a user named \'Chris\'', () => {
    expect(userList.serverFilteredUsers().some((user: User) => user.name === 'Chris')).toBe(true);
  });

  it('contain a user named \'Jamie\'', () => {
    expect(userList.serverFilteredUsers().some((user: User) => user.name === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a user named \'Santa\'', () => {
    expect(userList.serverFilteredUsers().some((user: User) => user.name === 'Santa')).toBe(false);
  });

  it('has two users that are 37 years old', () => {
    expect(userList.serverFilteredUsers().filter((user: User) => user.age === 37).length).toBe(2);
  });
});

