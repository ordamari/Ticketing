"use strict";
exports.__esModule = true;
exports.syncValidation = void 0;
exports.syncValidation = {
    isEmailValid: isEmailValid,
    isPasswordValid: isPasswordValid,
    isNotEmpty: isNotEmpty
};
var EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
function isNotEmpty(value) {
    return !!_getStringLength(value);
}
function isEmailValid(value) {
    return isNotEmpty(value) && EMAIL_REGEX.test(value);
}
function isPasswordValid(value) {
    return isNotEmpty(value) && value.length > 8;
}
function _getStringLength(value) {
    return value.trim().length;
}
