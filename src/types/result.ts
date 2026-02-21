export interface Result<T> {
    error: string | null,
    message: string,
    data: T
}
