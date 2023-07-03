import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { InputComponent } from 'src/app/shared/input/input.component';
import {
  PasswordValidatorService,
  passwordServiceMock
} from 'src/app/core/services/password-validator.service';

describe('HomeComponent', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        InputComponent,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {provide: HttpClient, useValue: httpClientSpy},
        {provide: PasswordValidatorService, useValue: passwordServiceMock}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('components', () => {
    it('should have 3 inputs', () => {
      const el = fixture.debugElement;
      const inputs = el.queryAll(By.css('app-input'));

      expect(inputs).toHaveSize(3);
    });

    it('should have a submit button', () => {
      const el: HTMLElement = fixture.nativeElement;
      const submitButton = el.querySelector('button');

      expect(submitButton?.textContent?.trim()).toBe('Enviar');
    });
  });

  describe('form', () => {
    it('should be disabled if all fields are empty', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it("shouldn't be able to send data to API if password is not valid", () => {
      const spy = spyOn(passwordServiceMock, 'submitPassword');
      
      component.form.setValue({
        name: 'test',
        email: 'test@test.com',
        password: '123456'
      });

      fixture.detectChanges();

      const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

      button.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it("should be able to send data to API if all data is valid", () => {
      const spy = spyOn(passwordServiceMock, 'submitPassword');
      spy.and.returnValue(of());

      component.form.setValue({
        name: 'test',
        email: 'test@test.com',
        password: '222222'
      });

      fixture.detectChanges();

      const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it("should show password error on 5 length password", () => {
      component.form.setValue({
        name: '',
        email: '',
        password: '12345'
      })
      fixture.detectChanges();
      
      const el = fixture.debugElement;
      const errorEl = el.query(By.css('#min-length-error-message'));

      expect(errorEl).not.toBeNull();
    });

    it("should show password error on desc order", () => {
      component.form.setValue({
        name: '',
        email: '',
        password: '222221'
      })
      fixture.detectChanges();
      
      const el = fixture.debugElement;
      const errorEl = el.query(By.css('#asc-sequence-error-message'));

      expect(errorEl).not.toBeNull();
    });

    it("should show password error on out of range password", () => {
      component.form.setValue({
        name: '',
        email: '',
        password: '111234'
      })
      fixture.detectChanges();
      
      const el = fixture.debugElement;
      const errorEl = el.query(By.css('#range-error-message'));

      expect(errorEl).not.toBeNull();
    });

    it("should show password error if there is no two equals numbers", () => {
      component.form.setValue({
        name: '',
        email: '',
        password: '234567'
      })
      fixture.detectChanges();
      
      const el = fixture.debugElement;
      const errorEl = el.query(By.css('#two-digits-error-message'));

      expect(errorEl).not.toBeNull();
    });

    it("should disable all inputs after send data to API", () => {
      const spy = spyOn(component, 'disableFormFields');
  
      component.form.setValue({
        name: 'test',
        email: 'test@test.com',
        password: '222222'
      });
      fixture.detectChanges();
  
      const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
  
      button.click();
  
      expect(spy).toHaveBeenCalled();
    });
  
    it("should enable all inputs after complete the API request", () => {
      const spy = spyOn(component, 'enableFormFields');
  
      component.form.setValue({
        name: 'test',
        email: 'test@test.com',
        password: '222222'
      });
      fixture.detectChanges();
  
      const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
  
      button.click();
  
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('feedback', () => {
    it('should display feedback message if API request secceed', () => {
      spyOn(passwordServiceMock, 'submitPassword').and.returnValue(
        new Observable<void>(observer => observer.next())
      );
      component.form.setValue({
        name: 'test',
        email: 'test@test.com',
        password: '222222'
      });
      fixture.detectChanges();
      
      const el = fixture.debugElement;
      const button: HTMLButtonElement = el.query(By.css('button')).nativeElement;      
      button.click();
      fixture.detectChanges();

      const messageEl = el.query(By.css('.form__actions--success'));
      expect(component.submitSuccess).toBeTrue();
      expect(messageEl).not.toBeNull();
    });

    it('should display feedback message if API request fail', () => {
      spyOn(passwordServiceMock, 'submitPassword').and.returnValue(
        new Observable<void>(observer => observer.error())
      );
      component.form.setValue({
        name: 'test',
        email: 'test@test.com',
        password: '222222'
      });
      fixture.detectChanges();
      
      const el = fixture.debugElement;
      const button: HTMLButtonElement = el.query(By.css('button')).nativeElement;      
      button.click();
      fixture.detectChanges();

      const messageEl = el.query(By.css('.form__actions--error'));
      expect(component.submitSuccess).toBeFalse();
      expect(messageEl).not.toBeNull();
    });
  });
});
