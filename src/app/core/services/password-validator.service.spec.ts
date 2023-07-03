import { TestBed } from '@angular/core/testing';

import { PasswordValidatorService } from './password-validator.service';
import { HttpClient } from '@angular/common/http';

describe('PasswordValidatorService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: PasswordValidatorService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpClientSpy}
      ]
    });
    service = TestBed.inject(PasswordValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loading behavior', () => {
    it('should have state loading at true when start loading', () => {
      service.startLoading();
      expect(service.loading).toBeTrue();
    });

    it('should have state loading at false when finish loading', () => {
      service.finishLoading();
      expect(service.loading).toBeFalse();
    });

    it('should have state loading at true when calling a fetch mtehod', () => {
      service.submitPassword({
        name: 'teste',
        email: 'a@b.c',
        password: '222222'
      });
      expect(service.loading).toBeTrue();
    });
  });

  describe('password verify method', () => {
    it('should call spy when submitting a new password', () => {
      service.submitPassword({
        name: 'teste',
        email: 'a@b.c',
        password: '222222'
      });
      expect(httpClientSpy.post).toHaveBeenCalled()
    });
  });
});
