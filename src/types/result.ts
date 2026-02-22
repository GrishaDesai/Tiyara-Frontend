export interface Result<T = unknown> {
    error: string | boolean | null;
    message: string;
    data: T;
}