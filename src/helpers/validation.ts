import { ValidationError } from "yup"

export const flattenErrors = (errors: Array<ValidationError>) => {
  return errors.reduce(errorReducer, {})
}

const errorReducer = (
  current: { [key: string]: Array<String> },
  item: ValidationError
) => {
  const key = item.path
  if (current[key]) {
    current[key].push(...item.errors)
  } else {
    current[key] = item.errors
  }
  return current
}
