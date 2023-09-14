import { UserInputError } from 'apollo-server-errors';

export class PropertyRequiredError extends UserInputError {
  constructor(property: string) {
    super(`You must specify ${property}`, {
      property,
      value: '',
    });
  }
}

export class PasswordMismatchError extends UserInputError {
  constructor(property: string, value: string) {
    super(`Passwords must match`, {
      property,
      value,
    });
  }
}

export class CustomError extends UserInputError {
  constructor(property: string, value: any, message: string) {
    super(message, {
      property,
      value,
    });
  }
}

export class UnknownError extends UserInputError {
  constructor(property: string, value: any, message: string) {
    super(message, {
      property,
      value,
    });
  }
}

// type PropertyRequiredErrorInput = Omit<ValidationError, 'constraints'>;
