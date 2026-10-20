export type ServiceResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";
