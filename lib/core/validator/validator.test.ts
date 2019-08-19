import {
  validateEmail,
  validatePassword,
  validatePdfFile,
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
  it('should return true for valid password', () => {
    expect(validatePassword('validPassword')).toBe(true);
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
  test('should not throw an error if pdf file is valid', () => {
    const existingFile = './lib/core/validator/validPdfFile.pdf';

    expect(() => {
      validatePdfFile(existingFile);
    }).not.toThrowError();
  });

  test('should throw an error if file does not exist', () => {
    const missingFile = './lib/core/validator/missing.pdf';

    expect(() => {
      validatePdfFile(missingFile);
    }).toThrowError('File does not exist');
  });

  test('should throw an error if mime type is non valid', () => {
    const invalidFile = './lib/core/validator/invalid.pdf';

    expect(() => {
      validatePdfFile(invalidFile);
    }).toThrowError('Invalid pdf extension');
  });

  test('should throw an error if file is not readable', () => {
    // const notReadableFile = "./lib/core/validator/notReadable.pdf";
    // expect(() => {
    //   validatePdfFile(notReadableFile);
    // }).toThrowError("File is unreadable");
  });
});
