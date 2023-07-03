import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidators } from 'src/app/core/validators/password';
import { PasswordValidatorService } from 'src/app/core/services/password-validator.service';
import { Subscription } from 'rxjs';
import { InputComponent } from 'src/app/shared/input/input.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private subscriptions: Subscription = new Subscription;
  submitSuccess: boolean | undefined;
  form: FormGroup = this.formBuilder.group({
    name: [
      '',
      Validators.compose([
        Validators.required
      ])
    ],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.email
      ])
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        PasswordValidators.hasTwoNumbers,
        PasswordValidators.isBetweenInteval,
        PasswordValidators.hasCrescentDigits,
      ])
    ]
  });

  constructor(
    public passwordValidatorService: PasswordValidatorService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get password() {return this.form.get('password');}

  submitData(e: Event) {
    e.preventDefault();
    this.disableFormFields();
    this.submitSuccess = undefined;

    this.subscriptions.add(
      this.passwordValidatorService.submitPassword({
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password
      }).subscribe({
        next: () => {
          this.submitSuccess = true;
        },
        error: () => {
          this.submitSuccess = false;
          this.enableFormFields();
          this.passwordValidatorService.finishLoading();
        },
        complete: () => {
          this.enableFormFields();
          this.passwordValidatorService.finishLoading();
        }
      })
    );
  }

  disableFormFields(): void {
    this.form.get('name')?.disable();
    this.form.get('email')?.disable();
    this.form.get('password')?.disable();
  }

  enableFormFields(): void {
    this.form.get('name')?.enable();
    this.form.get('email')?.enable();
    this.form.get('password')?.enable();
  }
}
