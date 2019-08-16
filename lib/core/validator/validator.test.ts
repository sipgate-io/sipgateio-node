import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from './validator';

describe('ValidateEmail test', () => {
  it('should return true for valid email address', () => {
    expect(validateEmail('validEmail@test.de')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(() => {
      validateEmail('invalidEmail');
    }).toThrowError(new Error('Invalid email'));

    expect(() => {
      validateEmail('@test.de');
    }).toThrowError(new Error('Invalid email'));

    expect(() => {
      validateEmail('@');
    }).toThrowError(new Error('Invalid email'));

    expect(() => {
      validateEmail(' ');
    }).toThrowError(new Error('Invalid email'));

    expect(() => {
      validateEmail('');
    }).toThrowError(new Error('Invalid email'));
  });
});

describe('ValidatePassword', () => {
  test('should not throw error for valid password', () => {
    expect(() => {
      validatePassword('validPassword');
    }).not.toThrowError(new Error('Invalid password'));
  });

  test('should throw error for invalid password', () => {
    expect(() => {
      validatePassword('');
    }).toThrowError(new Error('Invalid password'));

    expect(() => {
      validatePassword(' ');
    }).toThrowError(new Error('Invalid password'));
  });
});

describe('Phone validation', () => {
  test('valid phone number numbers', () => {
    expect(validatePhoneNumber('015739777777')).toBeTruthy();
  });

  test('valid phone number +numbers', () => {
    expect(validatePhoneNumber('+4915739777777')).toBeTruthy();
  });

  test('invalid phone number text', () => {
    expect(() => validatePhoneNumber('text')).toThrow(
      new Error('Invalid Phone Number'),
    );
  });

  test('invalid phone number empty', () => {
    expect(() => validatePhoneNumber('')).toThrow(
      new Error('Invalid Phone Number'),
    );
  });
});
