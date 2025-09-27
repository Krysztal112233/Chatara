export interface CommonResponse<T = unknown> {
  code: number
  msg?: string
  payload?: T
}
