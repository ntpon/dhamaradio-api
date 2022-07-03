export class HttpError {
  code: number
  message: string | []

  constructor(code: number, message: string | []) {
    this.code = code
    this.message = message
  }

  static badRequest(message: any) {
    return new HttpError(400, message)
  }

  static unauthorized(message: string) {
    return new HttpError(401, message)
  }

  static forbidden(message: string) {
    return new HttpError(403, message)
  }

  static notFound(message: string) {
    return new HttpError(404, message)
  }

  static methodNotAllowed(message: string) {
    return new HttpError(405, message)
  }

  static internal(message: string) {
    return new HttpError(500, message)
  }
}
