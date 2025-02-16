export type Service<I extends unknown[], O> = (...input: I) => Promise<O>;
