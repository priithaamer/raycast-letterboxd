export const isNil = <T>(value: T | null | undefined): value is null | undefined =>
  value === null || value === undefined;

export const notNil = <T>(value: T | null | undefined): value is T => !isNil(value);
