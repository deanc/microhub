class CustomError extends Error {
  code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = "CustomError"
    this.code = code
  }
}

export default CustomError
