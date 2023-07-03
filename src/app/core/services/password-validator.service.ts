import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

interface SubmitPassowrdInput {
  name: string
  email: string
  password: string
}

export const passwordServiceMock = {
  submitPassword: function ({}: SubmitPassowrdInput): Observable<void> {
    return of()
  }
}

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {
  private url: string = `${environment.apiBaseUrl}/valid-passwords`;
  serviceOccupied: boolean = false;

  constructor(
    private http: HttpClient
  ) {}

  startLoading(): void {
    this.serviceOccupied = true;
  }

  finishLoading(): void {
    this.serviceOccupied = false;
  }

  get loading(): boolean {return this.serviceOccupied;}

  submitPassword({name, email, password}: SubmitPassowrdInput): Observable<void> {
    this.startLoading();

    return this.http.post<void>(`${this.url}/results`, {
      name,
      email, password
    });
  }
}
