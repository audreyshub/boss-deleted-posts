import PasswordValidator from 'password-validator'

const PasswordSchema = new PasswordValidator()

PasswordSchema.is().min(8).is().max(100).has().lowercase().has().uppercase()

export const validateEmail = (email) => {
  const validationMatch = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return validationMatch.test(String(email).toLowerCase())
}

export const validatePassword = (pw) => {
  return PasswordSchema.validate(pw)
}

export const validateNotEmpty = (value) => {
  return value.length > 0
}

export const validateNotEmptyMuiSelect = (value) => {
  return value.length > 0
}

export const comparePasswords = (pw1, pw2) => {
  if (pw1 !== pw2) {
    return false
  }
  return true
}
