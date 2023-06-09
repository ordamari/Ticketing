export const syncValidation = {
  isEmailValid,
  isPasswordValid,
  isNotEmpty,
};

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function isNotEmpty(value: string) {
  return !!_getStringLength(value);
}

function isEmailValid(value: string) {
  return isNotEmpty(value) && EMAIL_REGEX.test(value);
}

function isPasswordValid(value: string) {
  return isNotEmpty(value) && value.length > 8;
}

function _getStringLength(value: string) {
  return value.trim().length;
}
