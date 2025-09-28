export interface CommonResponse<T = unknown> {
  code: number
  msg?: string
  payload?: T
}

export interface PagedData<T = unknown> {
  size: number
  next: boolean
  content: T[]
}
