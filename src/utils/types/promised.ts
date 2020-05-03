export type promised<T> = T extends Promise<infer R> ? R : T;
