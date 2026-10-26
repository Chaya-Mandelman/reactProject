export interface ApiErrorDetail {
  field: string
  message: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[]
  }
}
