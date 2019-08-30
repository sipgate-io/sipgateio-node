// tslint:disable-next-line: no-implicit-dependencies
import mockfs = require('mock-fs');
import {
  validateEmail,
  validatePassword,
  validatePdfFile,
  validatePhoneNumber,
} from './validator';
import validPDFBuffer from './validPDFBuffer';

describe('ValidateEmail', () => {
  test('should not throw error for valid email address', () => {
    expect(() => {
      validateEmail('validEmail@test.de');
    }).not.toThrowError(new Error('Invalid email'));
  });

  test('should throw error for invalid email address', () => {
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

describe('PDF file validation', () => {
  beforeAll(() => {
    mockfs({
      'path/to/invalid.pdf': '',
      'path/to/unreadable.pdf': mockfs.file({
        content: '',
        mode: Number(0o111),
      }),
      'path/to/valid.pdf': validPDFBuffer,
    });
  });

  afterAll(mockfs.restore);

  test('should not throw an error if pdf file is valid', () => {
    expect(() => {
      validatePdfFile('./path/to/valid.pdf');
    }).not.toThrowError();
  });

  test('should throw an error if file does not exist', () => {
    expect(() => {
      validatePdfFile('./path/to/missing.pdf');
    }).toThrowError('File does not exist');
  });

  test('should throw an error if mime type is non valid', () => {
    expect(() => {
      validatePdfFile('./path/to/invalid.pdf');
    }).toThrowError('Invalid pdf extension');
  });

  test('should throw an error if file is not readable', () => {
    expect(() => {
      validatePdfFile('./path/to/unreadable.pdf');
    }).toThrowError('File is unreadable');
  });
});
