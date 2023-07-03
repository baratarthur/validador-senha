import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputComponent,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component props', () => {
    it('should create a component with right prop id', () => {
      component.id = 'test-id';
      fixture.detectChanges();

      const el = fixture.debugElement;
      const input = el.query(By.css('#test-id'));

      expect(input).not.toBeNull();
    });

    it('should create a component with right type', () => {
      component.type = 'number';
      fixture.detectChanges();

      const el = fixture.debugElement;
      const input = el.query(By.css('[type="number"]'));

      expect(input).not.toBeNull();
    });

    it('should create a component with right placeholder', () => {
      component.placeholder = 'test-placeholder';
      fixture.detectChanges();

      const el = fixture.debugElement;
      const input = el.query(By.css('[placeholder="test-placeholder"]'));

      expect(input).not.toBeNull();
    });

    it('should display a success with useFeedback set as false', () => {
      component.useFeedback = true;
      component.formControl.markAsDirty();
      fixture.detectChanges();

      const el = fixture.debugElement;
      const inputSuccess = el.query(By.css('.input__feedback--success'));

      expect(inputSuccess).not.toBeNull();
    });

    it("shouldn't display a success with useFeedback set as false", () => {
      component.useFeedback = false;
      fixture.detectChanges();

      const el = fixture.debugElement;
      const inputSuccess = el.query(By.css('.input__feedback--success'));

      expect(inputSuccess).toBeNull();
    });
  });

  describe('component behavior', () => {
    it('should set input value if writeValue is called', () => {
      component.writeValue('test');
      fixture.detectChanges();

      expect(component.formControl.value).toBe('test');
    });

    it('should register on change function', () => {
      const spy = jasmine.createSpy('registerOnChangeFn');
      component.registerOnChange(spy);

      component.formControl.setValue('test');

      expect(spy).toHaveBeenCalledWith('test');
    });

    it('should disable input on set disabled state', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      const el = fixture.debugElement;
      const input = el.query(By.css('[disabled]'));

      expect(input).not.toBeNull();
    });

    it("shouldn't disable input on set false disabled state", () => {
      component.setDisabledState(false);
      fixture.detectChanges();

      const el = fixture.debugElement;
      const input = el.query(By.css(':not([disabled])'));

      expect(input).not.toBeNull();
    });
  });
});
