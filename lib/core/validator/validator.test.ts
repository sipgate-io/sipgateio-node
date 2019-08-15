import { validateEmail, validatePassword } from './validator';

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
  it('should return true for valid password', () => {
    expect(validatePassword('validPassword')).toBe(true);
  });
});
